const mongoose = require('mongoose');
const Schema = mongoose.Schema;


var TimesheetSchema = new Schema({
    course_id: Number,
    course_name: String,
    timesheet_data: String,
});
  
  var Timesheets = mongoose.model('Timesheets', TimesheetSchema, 'Timesheets' );

  module.exports = { Timesheets }