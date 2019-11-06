"use strict";

let qixiang = require("./qixiang");
let huanbao = require("./huanbao");
let tools = require("./utils/tools");

async function mainCircle(params) {
  console.log("start");
  qixiang.getSingleDay();
  // doEveryHour();
  // await tools.sleepTime(10);
  // doEveryDay();
  // await tools.sleepTime(10);
  // doEveryTwoWeeks();

  const hourCircle = setInterval(doEveryHour, 3600 * 1000);
  const dayCircle = setInterval(doEveryDay, 24 * 3600 * 1000);
  const twoWeeksCircle = setInterval(doEveryTwoWeeks, 14 * 24 * 3600 * 1000);
}

function doEveryHour() {
  console.log("每小时任务触发");
  huanbao.getHourData();
}
async function doEveryDay() {
  console.log("每日任务触发");
  huanbao.getTodayData();
  qixiang.getSingleDay();
  await tools.sleepTime(10);
  qixiang.getPast24h();
  await tools.sleepTime(10);
  qixiang.getFuture72h();
  await tools.sleepTime(10);
  qixiang.getWaring();
}

function doEveryTwoWeeks() {
  huanbao.getMonthData();
  console.log("每两周任务触发");
}
//即可以程序中用：
let args = process.argv.splice(2);
console.log(args);
global.writeToMongoDB = args.findIndex(obj => obj == "-noDB") == -1;
global.writeToJSON = args.findIndex(obj => obj == "-noJSON") == -1;
global.useProxy = args.findIndex(obj => obj == "-proxy") == -1;

mainCircle();
