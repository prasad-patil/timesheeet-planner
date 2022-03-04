const express = require('express');
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;

var { Subjects } = require('../models/subjects.js');
const { Teachers } = require('../models/teacher.js');

// => localhost:3000/teachers/
router.get('/', (req, res) => {
    // Teachers.find((err, docs) => {
    //     console.log(docs);
    //     if (!err) { res.send(docs); }
    //     else { console.log('Error in Retriving Teachers :' + JSON.stringify(err, undefined, 2)); }
    // });
    Subjects.find({}).then(content => {

        console.log("data was fetched");
        console.log(content);
        res.send(content);
})
.catch(err => { console.log("Error in Retriving Teachers") })
});

router.get('/:id', (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    Subjects.findById(req.params.id, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Retriving Teacher :' + JSON.stringify(err, undefined, 2)); }
    });
});


router.post('/', (req, res) => {
    Subjects.find({}).then(subjects => {
        let lastSubj = subjects[subjects.length -1];
        let subjectId = req.body.course_id; 
        if (!req.body.subject_id) {
            if (!lastSubj) {
                subjectId = 1;
            } else {
                subjectId = lastSubj.subject_id + 1;
            }
        }
        var subjects = new Subjects({
            subject_id: subjectId,
            name: req.body.name,
            course_id: req.body.course_id
        });
        subjects.save((err, doc) => {
            if (!err) { res.send(doc); }
            else { console.log('Error in course Save :' + JSON.stringify(err, undefined, 2)); }
        });
    })
});

router.put('/:id', (req, res) => {
    if ((typeof +req.params.id) !== 'number')
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    var subject = {
        subject_id: req.body.subject_id,
        name: req.body.name,
        course_id: req.body.course_id
    };
    Subjects.findOneAndUpdate({subject_id: req.body.subject_id}, { $set: subject }, { new: true }, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Subject Update :' + JSON.stringify(err, undefined, 2)); }
    });
});

router.delete('/:id', (req, res) => {
    if ((typeof +req.params.id) !== 'number')
        return res.status(400).send(`No record with given id : ${req.params.id}`);
        const subjectId = +req.params.id;
        Teachers.find({}).then(teachers => {
            const respectiveTeacher = teachers.find((teacher)=> +teacher.subject_id === +subjectId);
            if (respectiveTeacher) {
                respectiveTeacher.subject_id = null;
                Teachers.findOneAndUpdate({teacher_id: respectiveTeacher.teacher_id}, { $set: respectiveTeacher}).then(()=>{
                    deleteSubject(req, res);
                })
            } else {
                deleteSubject(req, res);
            }
        }).catch((err)=>{
            console.log('Error in Subject Update :' + JSON.stringify(err, undefined, 2));
        })
});

function deleteSubject(req, res) {
    Subjects.findOneAndRemove({subject_id: +req.params.id}, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Subject Delete :' + JSON.stringify(err, undefined, 2)); }
    });
}

module.exports = router;