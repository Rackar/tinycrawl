"use strict";
let fs = require("fs");
var path = require("path");
let request = require("request");
let dirExist = require("./dirExist");

function mainCircle(params) {
  console.log("start");
  doEveryHour();
  doEveryDay();
  // doEveryTwoWeeks();

  const hourCircle = setInterval(doEveryHour, 3600 * 1000);
  const dayCircle = setInterval(doEveryDay, 24 * 3600 * 1000);
  // const weekCircle = setInterval(doEveryWeek, 7 * 24 * 3600 * 1000);
  const twoWeeksCircle = setInterval(doEveryTwoWeeks, 14 * 24 * 3600 * 1000);
}

function doEveryHour() {
  console.log("每小时任务触发");
  getHourData();
}
function doEveryDay() {
  console.log("每日任务触发");
  getTodayData();
}
// function doEveryWeek() {
//   console.log("每周任务触发");
// }
function doEveryTwoWeeks() {
  getMonthData();
  console.log("每两周任务触发");
}

function readCSV() {
  function ConvertToTable(data, callBack) {
    data = data.toString();
    var table = new Array();
    var rows = new Array();
    rows = data.split("\r\n");
    let columns = rows[0].split(",");
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

    ConvertToTable(data, function(table) {
      console.log(table);
      return Promise.resolve(table);
    });
  });
}

function reqDayQixiang(datein, idin) {
  let arr = [0, 1];
  let id = "50425";
  let date = "20191104";
  let url_singleDay = `http://data.cma.cn/dataGis/gis/getStaDetailInfo?funitemmenuid=115990101&dateTime=${date}100000&typeCode=NWST&staId=${id}`;
  let url_past24h = `http://data.cma.cn/dataGis/exhibitionData/getSKStationInfo?funitemmenuid=115990101&typeCode=NWST&staId=${id}`;
  let url_future72h = `http://data.cma.cn/dataGis/exhibitionData/getStationInfo?funitemmenuid=115990101&typeCode=NWST&staId=${id}`;
  let url_warningtoday = `http://data.cma.cn/dataGis/disasterWarning/getWarningDataByCnty?startTime=${date}&endTime=${date}&codeType=&provinceCode=15`;
  console.log(url_singleDay);
}

const citys = {
  "150100": "呼和浩特市",
  "150200": "包头市",
  "150300": "乌海市",
  "150400": "赤峰市",
  "150500": "通辽市",
  "150600": "鄂尔多斯市",
  "150700": "呼伦贝尔市",
  "150800": "巴彦淖尔市",
  "150900": "乌兰察布市",
  "152200": "兴安盟",
  "152500": "锡林郭勒盟",
  "152900": "阿拉善盟",
  "150102": "新城区",
  "150103": "回民区",
  "150104": "玉泉区",
  "150105": "赛罕区",
  "150121": "土默特左旗",
  "150122": "托克托县",
  "150123": "和林格尔县",
  "150124": "清水河县",
  "150125": "武川县",
  "150202": "东河区",
  "150203": "昆都仑区",
  "150204": "青山区",
  "150205": "石拐区",
  "150206": "白云鄂博矿区",
  "150207": "九原区",
  "150221": "土默特右旗",
  "150222": "固阳县",
  "150223": "达尔罕茂明安联合旗",
  "150302": "海勃湾区",
  "150303": "海南区",
  "150304": "乌达区",
  "150402": "红山区",
  "150403": "元宝山区",
  "150404": "松山区",
  "150421": "阿鲁科尔沁旗",
  "150422": "巴林左旗",
  "150423": "巴林右旗",
  "150424": "林西县",
  "150425": "克什克腾旗",
  "150426": "翁牛特旗",
  "150428": "喀喇沁旗",
  "150429": "宁城县",
  "150430": "敖汉旗",
  "150502": "科尔沁区",
  "150521": "科尔沁左翼中旗",
  "150522": "科尔沁左翼后旗",
  "150523": "开鲁县",
  "150524": "库伦旗",
  "150525": "奈曼旗",
  "150526": "扎鲁特旗",
  "150581": "霍林郭勒市",
  "150602": "东胜区",
  "150603": "康巴什区",
  "150621": "达拉特旗",
  "150622": "准格尔旗",
  "150623": "鄂托克前旗",
  "150624": "鄂托克旗",
  "150625": "杭锦旗",
  "150626": "乌审旗",
  "150627": "伊金霍洛旗",
  "150702": "海拉尔区",
  "150703": "扎赉诺尔区",
  "150721": "阿荣旗",
  "150722": "莫力达瓦达斡尔族自治旗",
  "150723": "鄂伦春自治旗",
  "150724": "鄂温克族自治旗",
  "150725": "陈巴尔虎旗",
  "150726": "新巴尔虎左旗",
  "150727": "新巴尔虎右旗",
  "150781": "满洲里市",
  "150782": "牙克石市",
  "150783": "扎兰屯市",
  "150784": "额尔古纳市",
  "150785": "根河市",
  "150802": "临河区",
  "150821": "五原县",
  "150822": "磴口县",
  "150823": "乌拉特前旗",
  "150824": "乌拉特中旗",
  "150825": "乌拉特后旗",
  "150826": "杭锦后旗",
  "150902": "集宁区",
  "150921": "卓资县",
  "150922": "化德县",
  "150923": "商都县",
  "150924": "兴和县",
  "150925": "凉城县",
  "150926": "察哈尔右翼前旗",
  "150927": "察哈尔右翼中旗",
  "150928": "察哈尔右翼后旗",
  "150929": "四子王旗",
  "150981": "丰镇市",
  "152201": "乌兰浩特市",
  "152202": "阿尔山市",
  "152221": "科尔沁右翼前旗",
  "152222": "科尔沁右翼中旗",
  "152223": "扎赉特旗",
  "152224": "突泉县",
  "152501": "二连浩特市",
  "152502": "锡林浩特市",
  "152522": "阿巴嘎旗",
  "152523": "苏尼特左旗",
  "152524": "苏尼特右旗",
  "152525": "东乌珠穆沁旗",
  "152526": "西乌珠穆沁旗",
  "152527": "太仆寺旗",
  "152528": "镶黄旗",
  "152529": "正镶白旗",
  "152530": "正蓝旗",
  "152531": "多伦县",
  "152921": "阿拉善左旗",
  "152922": "阿拉善右旗",
  "152923": "额济纳旗"
};
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
async function renameFileIfExist(fileName) {
  let fileExist = await dirExist.fileExists(fileName);
  let repeatNum = 1;
  //文件已存在时添加
  while (fileExist) {
    fileName = fileName.slice(0, -5) + `(${repeatNum})` + fileName.slice(-5);
    fileExist = await dirExist.fileExists(fileName);
    repeatNum++;
  }
  return fileName;
}

async function saveResultJson(url, timeStr) {
  request.get(url, async (error, response, body) => {
    if (response.statusCode == 200) {
      await dirExist.dirExists("./resultData");
      let fileName = `resultData/${timeStr}环保空气污染指数.json`;
      fileName = await renameFileIfExist(fileName);
      body = JSON.stringify(JSON.parse(body), null, 2);
      fs.writeFile(fileName, body, "utf8", err => {
        if (err) throw err;
        console.log("写入完成：" + fileName);
      });
    }
  });
  await sleepTime(0.5);
}
function sleepTime(secends) {
  return new Promise(resolve => {
    setTimeout(() => resolve(), secends * 1000);
  });
}
function getMonthData(params) {
  // citys.forEach((city, index) => {
  for (let index in citys) {
    const monthUrl = "http://106.74.0.132:4000/api/cityDetail/";
    let urlFormat = monthUrl + index;
    let date = new Date();
    let timeStr = "月：" + date.format("YYYY-MM") + "月" + citys[index];
    saveResultJson(urlFormat, timeStr);
  }
}

function getTodayData() {
  for (let i = 0; i < 3; i++) {
    let urlFormat = `http://106.74.0.132:8088/api/map/${i}?type=day`;

    let date = new Date();
    let timeStr =
      "日：" +
      date.format("YYYY-MM-DD") +
      "日" +
      (i == 0 ? "盟市级" : i == 1 ? "旗县级" : i == 2 ? "监测点" : "其他");
    saveResultJson(urlFormat, timeStr);
  }
}

function getHourData() {
  for (let i = 0; i < 3; i++) {
    let urlFormat = `http://106.74.0.132:8088/api/map/${i}?type=hour`;

    let date = new Date();
    let timeStr =
      "时：" +
      date.format("YYYY-MM-DD") +
      " " +
      (date.getHours() > 9
        ? date.getHours().toString()
        : "0" + date.getHours()) +
      "时" +
      (i == 0 ? "盟市级" : i == 1 ? "旗县级" : i == 2 ? "监测点" : "其他");

    saveResultJson(urlFormat, timeStr);
  }
}

// async function test(params) {
//   console.log("start");
//   await sleepTime(1);
//   console.log("1s");
// }
// test();
mainCircle();
