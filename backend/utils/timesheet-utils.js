const { Timesheets } = require('../models/timesheet.js');

async function saveTimeSheet(data) {
    var timesheet = new Timesheets({
        course_id: data.course_id,
        timesheet_data: JSON.stringify(data.timesheet_data)
    });
    return timesheet.save();
}

async function deleteTimeSheet(course_id) {
    return Timesheets.findOneAndRemove({course_id: course_id});
}

async function getAllTimesheets() {
    return Timesheets.find({});
}

async function getTimeSheetById(course_id) {
    return Timesheets.findOne({course_id: course_id});
}

module.exports = {
    saveTimeSheet,
    deleteTimeSheet,
    getAllTimesheets,
    getTimeSheetById
}