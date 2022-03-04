const mongoose = require('mongoose');
const Schema = mongoose.Schema;


var SubjectSchema = new Schema({
    subject_id: Number,
    name: String,
    course_id: Number
});
  
  var Subjects = mongoose.model('Subjects', SubjectSchema, 'Subjects' );

  module.exports = { Subjects}