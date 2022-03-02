const express = require('express');
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;

var { Courses } = require('../models/courses');

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

// router.get('/:id', (req, res) => {
//     if (!ObjectId.isValid(req.params.id))
//         return res.status(400).send(`No record with given id : ${req.params.id}`);

//     Teachers.findById(req.params.id, (err, doc) => {
//         if (!err) { res.send(doc); }
//         else { console.log('Error in Retriving Teacher :' + JSON.stringify(err, undefined, 2)); }
//     });
// });

// router.post('/', (req, res) => {
//     var emp = new Teachers({
//         name: req.body.name
//     });
//     emp.save((err, doc) => {
//         if (!err) { res.send(doc); }
//         else { console.log('Error in Teacher Save :' + JSON.stringify(err, undefined, 2)); }
//     });
// });

// router.put('/:id', (req, res) => {
//     if (!ObjectId.isValid(req.params.id))
//         return res.status(400).send(`No record with given id : ${req.params.id}`);

//     var teacher = {
//         name: req.body.name,
//         position: req.body.position,
//         office: req.body.office,
//         salary: req.body.salary,
//     };
//     Teachers.findByIdAndUpdate(req.params.id, { $set: teacher }, { new: true }, (err, doc) => {
//         if (!err) { res.send(doc); }
//         else { console.log('Error in Teacher Update :' + JSON.stringify(err, undefined, 2)); }
//     });
// });

// router.delete('/:id', (req, res) => {
//     if (!ObjectId.isValid(req.params.id))
//         return res.status(400).send(`No record with given id : ${req.params.id}`);

//     Teachers.findByIdAndRemove(req.params.id, (err, doc) => {
//         if (!err) { res.send(doc); }
//         else { console.log('Error in Teacher Delete :' + JSON.stringify(err, undefined, 2)); }
//     });
// });

module.exports = router;