var mongoose = require("./db_mongoose");
var Schema = mongoose.Schema;

var HourSchema = new Schema(
  {
    time: String,
    body: Object,
    city: String,
    type: String
  },
  {strict: false}
);
module.exports = mongoose.model("Hour", HourSchema);
