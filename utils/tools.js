function format(formatStr) {
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
}

function sleepTime(secends) {
  return new Promise(resolve => {
    setTimeout(() => resolve(), secends * 1000);
  });
}
exports.format = format;
exports.sleepTime = sleepTime;
