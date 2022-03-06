const { Timesheets } = require('../models/timesheet.js');
const { Courses } = require('../models/courses.js');

async function saveTimeSheet(data) {
    const course = await Courses.findOne({course_id: +data.course_id});
    var timesheet = new Timesheets({
        course_id: data.course_id,
        course_name: course.course_name,
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

async function deleteTimesheetById(course_id) {
    return Timesheets.findOneAndRemove({course_id: +course_id});
}

module.exports = {
    saveTimeSheet,
    deleteTimeSheet,
    getAllTimesheets,
    getTimeSheetById,
    deleteTimesheetById
}