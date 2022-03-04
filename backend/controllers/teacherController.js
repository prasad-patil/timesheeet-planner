const express = require('express');
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;

var { Teachers } = require('../models/teacher');

// => localhost:3000/teachers/
router.get('/', (req, res) => {
    Teachers.find({}).then(content => {

        console.log("data was fetched");
        console.log(content);
        res.send(content);
})
.catch(err => { console.log("Error in Retriving Teachers") })
});

router.get('/:id', (req, res) => {
    if ((typeof +req.params.id) !== 'number')
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    Teachers.findOne({teacher_id: +req.params.id}, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Retriving Teacher :' + JSON.stringify(err, undefined, 2)); }
    });
});

router.post('/', (req, res) => {
    Teachers.find({}).then(teachers => {
        let lastTeacher = teachers[teachers.length -1];
        let teacherId = req.body.teacher_id; 
        if (!req.body.teacher_id) {
            if (!lastTeacher) {
                teacherId = 1;
            } else {
                teacherId = lastTeacher.teacher_id + 1;
            }
        }
        var teacher = new Teachers({
            teacher_id: teacherId,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            subject_id: req.body.subject_id,
        });
        teacher.save((err, doc) => {
            if (!err) { res.send(doc); }
            else { console.log('Error in Teacher Save :' + JSON.stringify(err, undefined, 2)); }
        });
    })
});

router.put('/:id', (req, res) => {
    if ((typeof +req.params.id) !== 'number')
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    var teacher = {
        teacher_id: +req.body.teacher_id,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        subject_id: req.body.subject_id,
    };
    Teachers.findOneAndUpdate({teacher_id: req.body.teacher_id}, { $set: teacher }, { new: true }, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Teacher Update :' + JSON.stringify(err, undefined, 2)); }
    });
});


router.delete('/:id', (req, res) => {
    if ((typeof +req.params.id) !== 'number')
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    Teachers.findOneAndRemove({teacher_id: +req.params.id}, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Reacher Delete :' + JSON.stringify(err, undefined, 2)); }
    });
});

module.exports = router;