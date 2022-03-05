const express = require('express');
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;

var { Courses } = require('../models/courses');
var { Subjects } =  require('../models/subjects');
var { Teachers } =  require('../models/teacher');


// => localhost:3000/courses/
router.get('/', (req, res) => {
    // Teachers.find((err, docs) => {
    //     console.log(docs);
    //     if (!err) { res.send(docs); }
    //     else { console.log('Error in Retriving Teachers :' + JSON.stringify(err, undefined, 2)); }
    // });
    Courses.find({}).then(content => {

        console.log("data was fetched");
        console.log(content);
        res.send(content);
    })
    .catch(err => { console.log("Error in Retriving Courses") })
});

router.get('/:id', (req, res) => {
    if ((typeof +req.params.id) !== 'number')
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    Courses.findOne({course_id: req.params.id}, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Retriving Teacher :' + JSON.stringify(err, undefined, 2)); }
    });
});

router.post('/', (req, res) => {
    Courses.find({}).then(courses => {
        let lastCourse = courses[courses.length -1];
        let courseId = req.body.course_id; 
        if (!req.body.course_id) {
            if (!lastCourse) {
                courseId = 1;
            } else {
                courseId = lastCourse.course_id + 1;
            }
        }
        var course = new Courses({
            course_id: courseId,
            course_name: req.body.course_name,
            course_year: req.body.course_year,
            course_sem: req.body.course_sem,
        });
        course.save((err, doc) => {
            if (!err) { res.send(doc); }
            else { console.log('Error in course Save :' + JSON.stringify(err, undefined, 2)); }
        });
    })
});

router.put('/:id', (req, res) => {
    if ((typeof +req.params.id) !== 'number')
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    var course = {
        course_id: req.body.course_id,
        course_name: req.body.course_name,
        course_year: req.body.course_year,
        course_sem: req.body.course_sem,
    };
    Courses.findOneAndUpdate({course_id: req.body.course_id}, { $set: course }, { new: true }, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Course Update :' + JSON.stringify(err, undefined, 2)); }
    });
});

router.delete('/:id', (req, res) => {
    if ((typeof +req.params.id) !== 'number')
        return res.status(400).send(`No record with given id : ${req.params.id}`);
    const courseId = +req.params.id;
    Subjects.find({}).then(subjects => {
        const respSubjects = subjects.filter((subject)=> subject.course_id === courseId);
        if (respSubjects && respSubjects.length > 0) {
            const subIds = [], subject_ids = [];
            respSubjects.forEach(sub => {
                subIds.push(sub._id);
                subject_ids.push(sub.subject_id);
            });
            delinkRepsectiveTeachers(subject_ids).then(()=>{
                Subjects.deleteMany({_id: subIds}).then(()=>{
                    deleteCourse(courseId, res);
                }).catch(()=>{
                    console.log('Error in Course Delete :' + JSON.stringify(err, undefined, 2));
                });
            });
        } else {
            deleteCourse(courseId, res);
        }

    });
});

function deleteCourse(courseId, res) {
    Courses.findOneAndRemove({course_id: courseId}, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Course Delete :' + JSON.stringify(err, undefined, 2)); }
    });
}

async function delinkRepsectiveTeachers(subjectIds) {
    try {
        const teachers = await Teachers.find({});        
        await asyncForEach(subjectIds, async (subjectId)=> {
            const respectiveTeacher = teachers.find((teacher)=> +teacher.subject_id === +subjectId);
            if (respectiveTeacher) {
                respectiveTeacher.subject_id = null;
                await Teachers.findOneAndUpdate({teacher_id: respectiveTeacher.teacher_id}, { $set: respectiveTeacher});
            }
        });        
    } catch (err) {
        console.log('Error in course Update :' + JSON.stringify(err, undefined, 2));
    }
}

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

module.exports = router;