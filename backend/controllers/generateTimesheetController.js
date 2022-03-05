const express = require('express');
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;
var { Subjects } = require('../models/subjects.js');
const { Teachers } = require('../models/teacher.js');

const day1 = 'MONDAY', day2 = 'TUESDAY', day3 = 'WEDNESDAY',day4 = 'THURSDAY',day5 = 'FRIDAY', day6= 'SATURDAY', day7 ='SUNDAY';
const slot_timing1 = '9.00 AM - 10.00 AM', slot_timing2= '10.00 AM - 11.00 AM', slot_timing3= '11.00 AM - 12.00 PM', slot_timing4= '12.00 PM - 1.00 PM', slot_timing5= '1.00 PM - 1.30 PM', 
slot_timing6= '1.30 PM - 2.30 PM', slot_timing7= '2.30 PM - 3.30 PM', slot_timing8= '3.30 PM - 4.30 PM' ;
const total_slot = 7;
const total_days = 5;

class Slot {
    constructor(teacher_id,subject_id,slot_timing){
        this.teacher_id = teacher_id,
        this.subject_id = subject_id,
        this.slot_timing = slot_timing,
        this.teacher_name = '',
        this.subject_name = ''
    }
}

class Day {
    constructor(day){
        this.day = day;
        this.slot0 = new Slot(null,null, slot_timing1)
        this.slot1 = new Slot(null,null, slot_timing2)
        this.slot2 = new Slot(null,null, slot_timing3)
        this.slot3 = new Slot(null,null, slot_timing4)
        this.slot4 = new Slot(null,null, slot_timing5)
        this.slot5 = new Slot(null,null, slot_timing6)
        this.slot6 = new Slot(null,null, slot_timing7)
        this.slot7 = new Slot(null,null, slot_timing8)
    }

    getSlot(slotIndex) {
        return this[`slot${slotIndex}`];
    }

    isSlotAvailable(slotIndex) {
        const slot = this.getSlot(slotIndex);
        if (slot.subject_id == null) {
            return true;
        }
        return false;
    }

    assignSlot(slotIndex, slotDetails, subjects, teachers) {
        const slot = this.getSlot(slotIndex);
        slot.teacher_id = slotDetails.teacher_id;
        slot.teacher_name = getTeacherById(teachers, slot.teacher_id);
        slot.subject_id = slotDetails.subject_id;
        slot.subject_name = getSubjectById(subjects, slot.subject_id);
    }

    isLunchPeriod(slot) {
        if (slot.slot_timing === slot_timing5) {
            return true;
        }
        return false;
    }

    setLunchPeriod(slot) {
        slot.teacher_id = -1;
        slot.subject_id = -1;
    }
    setOffPeriod(slot) {
        slot.teacher_id = 0;
        slot.subject_id = 0;
    }
}

function generateTimetableDataStructure(){
    let days = [new Day(day1),new Day(day2),new Day(day3),new Day(day4),new Day(day5)]
    return days;
}

// => localhost:3000/teachers/
router.post('/', (req, res) => {
    console.log(req.body);
    // {
    //     course_id: 1, 
    //     total_hours: 18, 
    //     periods: [
    //         {teacher_id: 2, subject_id: 1, hours: 9},
    //         {teacher_id: 1, subject_id: 2, hours: 9}
    //     ]
    // }
    generateTimeTableTable(req.body).then((result)=> {
        res.send(result);
    });
});

async function generateTimeTableTable(data) {
    const days = generateTimetableDataStructure();
    const teachers = await Teachers.find({});
    const subjects = await Subjects.find({});
    
    for (let period_index = 0; period_index < data.periods.length; period_index++) {
        for (let slot_index = 0; slot_index <= total_slot; slot_index = slot_index + 2) {
            generateForDay(days, slot_index, data, period_index, teachers, subjects)
        }
        for (let slot_index = 1; slot_index <= total_slot; slot_index = slot_index + 2) {
            generateForDay(days, slot_index, data, period_index, teachers, subjects)
        }   
    }
    return days;
}

function generateForDay (days, slot_index, data, period_index, teachers, subjects) {
    for (let days_index = 0; days_index < total_days; days_index++) {
        const current_day = days[days_index];
        const current_slot = days[days_index].getSlot([slot_index]);
        const current_period = data.periods[period_index];
        if (current_day.isLunchPeriod(current_slot)) {
            current_day.setLunchPeriod(current_slot);
        } else {
            if (current_period.hours > 0) {
                if (current_day.isSlotAvailable(slot_index)) {
                    current_day.assignSlot(slot_index, current_period, subjects, teachers);
                    current_period.hours = current_period.hours -1;
                } else {
                    continue;
                }
            }
        }
    }
}

function getSubjectById (subjects, subject_id) {
    const subject = subjects.find((sub)=> sub.subject_id === subject_id);
    return subject ? subject.name : '';
}

function getTeacherById (teachers, teacher_id) {
    const teacher = teachers.find((current_teacher)=> current_teacher.teacher_id === teacher_id);
    return teacher ? teacher.firstname + ' ' + (teacher.lastname? teacher.lastname[0].toUpperCase() : '') : '';
}

module.exports = router;