const mongoose = require('mongoose');
const Schema = mongoose.Schema;


var TeacherSchema = new Schema({
    firstname: String,
    lastname: String,
    subject_id: String,
    teacher_id: Number,
  });
  
  var Teachers = mongoose.model('Teachers', TeacherSchema, 'Teachers' );

  module.exports = { Teachers}