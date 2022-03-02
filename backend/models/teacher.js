const mongoose = require('mongoose');
const Schema = mongoose.Schema;


var TeacherSchema = new Schema({
    firstname: String,
    lastname: String,
    subject: String,
    teacher_id: Number,
    dob: Date,
    sex: String
  });
  
  var Teachers = mongoose.model('Teachers', TeacherSchema, 'Teachers' );

  module.exports = { Teachers}