"use strict";

let qixiang = require("./qixiang");
let huanbao = require("./huanbao");

function mainCircle(params) {
  console.log("start");
  doEveryHour();
  doEveryDay();
  doEveryTwoWeeks();

  const hourCircle = setInterval(doEveryHour, 3600 * 1000);
  const dayCircle = setInterval(doEveryDay, 24 * 3600 * 1000);
  const twoWeeksCircle = setInterval(doEveryTwoWeeks, 14 * 24 * 3600 * 1000);
}

function doEveryHour() {
  console.log("每小时任务触发");
  qixiang.getHourData();
}
function doEveryDay() {
  console.log("每日任务触发");
  qixiang.getTodayData();
}

function doEveryTwoWeeks() {
  qixiang.getMonthData();
  console.log("每两周任务触发");
}

mainCircle();
