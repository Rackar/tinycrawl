"use strict";
let fs = require("fs");
let request = require("request");
let dirExist = require("./utils/dirExist");
var qxPast24h = require("./db/qxPast24h");
var qxFuture72h = require("./db/qxFuture72h");
var qxTodayWarning = require("./db/qxTodayWarning");
var qxDay = require("./db/qxDay");
let tools = require("./utils/tools");
let Agent = require("./utils/agent");
let codelist = require("./data/citys.json");
async function saveResultJson(url, timeStr) {
  return new Promise((resolve, reject) => {
    request(
      {
        url: url, //请求路径
        method: "GET", //请求方式，默认为get
        headers: {
          //设置请求头
          "content-type": "application/json",
          Host: "data.cma.cn",
          "User-Agent":
            "Mozilla/ 5.0(iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit / 604.1.38(KHTML, like Gecko) Version / 11.0 Mobile / 15A372 Safari / 604.1"
        }
      },
      // request.get(url,
      async (error, response, body) => {
        // body "{"returnCode":"1","list":[]}"
        if (response.statusCode == 200) {
          await dirExist.dirExists("./resultDataQX");
          let fileName = `resultDataQX/${timeStr}气象数据.json`;
          fileName = await dirExist.renameJsonFileIfExist(fileName);
          let data = JSON.parse(body);
          if (data.returnCode === "0" && data.list && data.list.length) {
            body = JSON.stringify(data.list, null, 2);
            await fs.writeFile(fileName, body, "utf8", err => {
              if (err) throw err;
              console.log("写入完成：" + fileName);
            });
            resolve(data.list);
          } else if (data.returnCode === "1") {
            reject();
          } else {
            body = JSON.stringify(data, null, 2);
            await fs.writeFile(fileName, body, "utf8", err => {
              if (err) throw err;
              console.log("写入完成：" + fileName);
            });
            resolve(data);
          }
        }
      }
    );
  });
}
Date.prototype.format = function(formatStr) {
  var str = formatStr;
  str = str.replace(/yyyy|YYYY/, this.getFullYear());
  str = str.replace(
    /MM/,
    this.getMonth() + 1 > 9
      ? (this.getMonth() + 1).toString()
      : "0" + (this.getMonth() + 1)
  );
  str = str.replace(
    /dd|DD/,
    this.getDate() > 9 ? this.getDate().toString() : "0" + this.getDate()
  );
  return str;
};

// function sleepTime(secends) {
//   return new Promise(resolve => {
//     setTimeout(() => resolve(), secends * 1000);
//   });
// }
function onInsert(err, docs) {
  if (err) {
    // TODO: handle error
    console.log(err);
  } else {
    console.info("%d potatoes were successfully stored.", docs.insertedCount);
  }
}
function readCSV() {
  function ConvertToTable(data, callBack) {
    data = data.toString();
    var table = new Array();
    var rows = new Array();
    rows = data.split("\r\n");
    let columns = [
      "province",
      "code",
      "name",
      "lat",
      "long",
      "chuanganqi",
      "guancezhan"
    ];
    for (var i = 1; i < rows.length; i++) {
      var obj = {};
      let len = rows[i].split(",");
      for (let j = 0; j < len.length; j++) {
        obj[columns[j]] = len[j];
      }
      table.push(obj);
    }
    callBack(table);
  }
  fs.readFile("./data/nmg_station.csv", function(err, data) {
    var table = new Array();
    if (err) {
      console.log(err.stack);
      return Promise.reject(err);
    }

    ConvertToTable(data, async function(table) {
      // console.log(table);
      let body = JSON.stringify(table, null, 2);
      await fs.writeFile("citys.json", body, "utf8", err => {
        if (err) throw err;
        console.log("写入完成：");
      });

      return Promise.resolve(table);
    });
  });
}

async function getSingleDay() {
  // let codelist = [
  //   {
  //     code: 50425,
  //     name: "额尔古纳市",
  //     lat: 50.15,
  //     long: 120.11,
  //     chuanganqi: 582.3,
  //     guancechang: 581.4
  //   }
  // ];

  let date = new Date(Date.now() - 24 * 60 * 60 * 1000);
  let today = date.format("YYYYMMDD");
  let results = [];
  for (let i = 0; i < codelist.length; i++) {
    let urlFormat = `http://data.cma.cn/dataGis/gis/getStaDetailInfo?funitemmenuid=115990101&dateTime=${today}100000&typeCode=NWST&staId=${codelist[i].code}`;
    console.log(urlFormat);
    let timeStr = "日：" + date.format("YYYY-MM-DD") + "日" + codelist[i].name;
    let result = await saveResultJson(urlFormat, timeStr);
    results.push(...result);
    console.log(i);
    await tools.sleepTime(4);
  }
  console.log("end");
  qxDay.collection.insertMany(results, onInsert);
}

async function getPast24h() {
  // let codelist = [
  //   {
  //     code: 50425,
  //     name: "额尔古纳市",
  //     lat: 50.15,
  //     long: 120.11,
  //     chuanganqi: 582.3,
  //     guancechang: 581.4
  //   }
  // ];
  let results = [];
  let date = new Date();
  for (let i = 0; i < codelist.length; i++) {
    let urlFormat = `http://data.cma.cn/dataGis/exhibitionData/getSKStationInfo?funitemmenuid=115990101&typeCode=NWST&staId=${codelist[i].code}`;

    let timeStr =
      "过去24h：" + date.format("YYYY-MM-DD") + "日" + codelist[i].name;
    let result = await saveResultJson(urlFormat, timeStr);
    result.code = codelist[i].code;
    result.name = codelist[i].name;
    result.date = date.format("YYYYMMDD");
    results.push(result);

    await tools.sleepTime(5);
  }
  qxPast24h.collection.insertMany(results, onInsert);
}

async function getFuture72h() {
  // console.log(json);
  // let codelist = [
  //   {
  //     code: 50425,
  //     name: "额尔古纳市",
  //     lat: 50.15,
  //     long: 120.11,
  //     chuanganqi: 582.3,
  //     guancechang: 581.4
  //   }
  // ];

  let results = [];
  let date = new Date();
  for (let i = 0; i < codelist.length; i++) {
    let urlFormat = `http://data.cma.cn/dataGis/exhibitionData/getStationInfo?funitemmenuid=115990101&typeCode=NWST&staId=${codelist[i].code}`;

    let timeStr =
      "未来72h：" + date.format("YYYY-MM-DD") + "日" + codelist[i].name;
    let result = await saveResultJson(urlFormat, timeStr);
    result.code = codelist[i].code;
    result.name = codelist[i].name;
    result.date = date.format("YYYYMMDD");
    results.push(result);

    await tools.sleepTime(5);
  }
  qxFuture72h.collection.insertMany(results, onInsert);
}

async function getWaring() {
  let date = new Date();
  let lastday = new Date(date - 24 * 60 * 60 * 1000);

  let today = date.format("YYYY-MM-DD");
  let yestoday = lastday.format("YYYY-MM-DD");
  let urlFormat = `http://data.cma.cn/dataGis/disasterWarning/getWarningDataByCnty?startTime=${yestoday}&endTime=${today}&codeType=&provinceCode=15`;
  let timeStr = "天气预警：" + today + "日";
  let result = await saveResultJson(urlFormat, timeStr);

  await tools.sleepTime(5);

  qxTodayWarning.collection.insertMany(result, onInsert);
}

exports.getPast24h = getPast24h;
exports.getFuture72h = getFuture72h;
exports.getWaring = getWaring;
exports.getSingleDay = getSingleDay;
// exports.readCSV = readCSV;
