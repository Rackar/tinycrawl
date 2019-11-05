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
