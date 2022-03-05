const express = require('express');
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;

var { Courses } = require('../models/courses');
var { Subjects } =  require('../models/subjects');
var { Teachers } =  require('../models/teacher');


// => localhost:3000/retriveSubjectTeacherByCourseId/:id

router.get('/:id', (req, res) => {
    if ((typeof +req.params.id) !== 'number')
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    const doc = retriveByCourse(+req.params.id).then((doc)=>{
        res.send(doc);
    });
});

async function retriveByCourse(courseId) {
    try {
        const course = await Courses.findOne({course_id: courseId}).lean();
        const allSubjects = await Subjects.find({}).lean();
        const allTeachers = await Teachers.find({}).lean();
        const subjects = allSubjects.filter((subject)=>{
            return subject.course_id == course.course_id;
        });
        const subjectTeacherArray = [];
        subjects.forEach((subject)=>{
            const respectiveTeacher = allTeachers.find((teacher)=> +teacher.subject_id === subject.subject_id);
            let sub = {};
            sub = respectiveTeacher ? {...subject, teacher: respectiveTeacher} : {...subject};
            subjectTeacherArray.push(sub);
        });
        return subjectTeacherArray;
    } catch(err) {
        console.log('Error in Retriving Teacher :' + JSON.stringify(err, undefined, 2));
    }
}

module.exports = router;