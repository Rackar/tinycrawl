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

function parseObjReplaceDot(obj) {
  let newObj = {};
  for (let key in obj) {
    var newkey = key.replace(".", "_");
    let isObj = obj[key].constructor === Object;
    let isArr = obj[key].constructor === Array;
    if (isObj) {
      newObj[newkey] = parseObjReplaceDot(obj[key]);
    } else if (isArr) {
      let newArr = [];
      obj[key].forEach(arrObj => {
        if (arrObj.constructor === Object) {
          newArr.push(parseObjReplaceDot(arrObj));
        } else if (arrObj.constructor === Array) {
          newArr.push(parseObjReplaceDot(arrObj));
        } else {
          newArr.push(arrObj);
        }
      });
      newObj[newkey] = newArr;
    } else {
      newObj[newkey] = obj[key];
    }
  }
  return newObj;
}
// let testObj = {
//   a: "x",
//   "c.c": {
//     "pm2.5": 3,
//     pm10: {
//       "pm2.5": 3
//     }
//   },
//   b: {
//     "pm2.5": 3,
//     pm10: 2
//   },
//   d: [
//     [
//       {
//         "pm2.5": 3,
//         pm10: ["a", "b", "c", "d"]
//       },
//       {
//         "pm2.5": 3,
//         pm10: [
//           {
//             "pm2.5": 3,
//             pm10: 2
//           }
//         ]
//       }
//     ]
//   ]
// };
// console.log(parseObjReplaceDot(testObj));

exports.format = format;
exports.sleepTime = sleepTime;
exports.parseObjReplaceDot = parseObjReplaceDot;
