const express = require('express');
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;
const { getTimeSheetById, getAllTimesheets} = require('../utils/timesheet-utils.js')

// => localhost:3000/teachers/
router.get('/', (req, res) => {
    getAllTimesheets().then(content => {

        console.log("data was fetched");
        console.log(content);
        res.send(content);
})
.catch(err => { console.log("Error in Retriving Teachers") })
});

router.get('/:id', (req, res) => {
    if ((typeof +req.params.id) !== 'number')
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    getTimeSheetById(+req.params.id).then((doc)=>{
        let result = JSON.parse(doc.timesheet_data);
        res.send(result);
    }).catch((err)=>{
        console.log('Error in Retriving Teacher :' + JSON.stringify(err, undefined, 2));
    });
});
5

module.exports = router;