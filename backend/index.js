const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const { mongoose } = require('./db.js');
var teacherController = require('./controllers/teacherController.js');
var courseController = require('./controllers/courseController.js');
var subjectsController = require('./controllers/subjectController.js');
var retriveSubjectTeacherByCourseIdController = require('./controllers/retriveSubjectTeacherByCourseIdController.js');
var generateTimeSheetController = require('./controllers/generateTimeSheetController.js');
var timeSheetController = require('./controllers/timesheetController.js');

var app = express();
app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:4200' }));

app.listen(3000, () => console.log('Server started at port : 3000'));


app.use('/teachers', teacherController);
app.use('/courses', courseController);
app.use('/subjects', subjectsController);
app.use('/retirveSubjectTeacherByCourse', retriveSubjectTeacherByCourseIdController);
app.use('/generateTimeSheetController', generateTimeSheetController);
app.use('/timeSheets', timeSheetController);