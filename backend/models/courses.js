const mongoose = require('mongoose');
const Schema = mongoose.Schema;


var CoursesSchema = new Schema({
    course_id: Number,
    course_name: String,
    course_year: String,
    course_sem: Number,
  });
  
  var Courses = mongoose.model('Courses', CoursesSchema, 'Courses' );

  module.exports = { Courses}