var mongoose = require("./db_mongoose");
var Schema = mongoose.Schema;

var MonthSchema = new Schema(
  {
    time: String,
    body: Object,
    city: String,
    type: String
  },
  {strict: false}
);
module.exports = mongoose.model("Month", MonthSchema);
