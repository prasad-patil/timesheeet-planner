import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoursesService } from 'src/app/courses/courses.service';
import { GenerateTimeSheetService } from '../generate-timesheet/generate-timesheet.service';

@Component({
  selector: 'app-view-timesheet',
  templateUrl: './view-timesheet.component.html',
  styleUrls: ['./view-timesheet.component.scss']
})
export class ViewTimesheetComponent implements OnInit {

  timeSheetData: any;
  courseDetails: any;
  courseId: number;
  timings: any;
  constructor(private generateTimeSheetService: GenerateTimeSheetService, private courseService: CoursesService, private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.timings = [];
    this.route.params.subscribe((params: any)=>{
      if (params.id) {
        this.courseService.getCourseById(+params.id).subscribe((course)=>{
          this.courseDetails = course;
          console.log(course)
        })
      }
    });
    //this.timeSheetData = this.generateTimeSheetService.timetableData;


    const data = '[{"day":"MONDAY","slot0":{"teacher_id":1,"subject_id":1,"slot_timing":"9.00 AM - 10.00 AM"},"slot1":{"teacher_id":3,"subject_id":3,"slot_timing":"10.00 AM - 11.00 AM"},"slot2":{"teacher_id":1,"subject_id":1,"slot_timing":"11.00 AM - 12.00 PM"},"slot3":{"teacher_id":3,"subject_id":3,"slot_timing":"12.00 PM - 1.00 PM"},"slot4":{"teacher_id":-1,"subject_id":-1,"slot_timing":"1.00 PM - 1.30 PM"},"slot5":{"teacher_id":4,"subject_id":4,"slot_timing":"1.30 PM - 2.30 PM"},"slot6":{"teacher_id":5,"subject_id":2,"slot_timing":"2.30 PM - 3.30 PM"},"slot7":{"teacher_id":2,"subject_id":5,"slot_timing":"3.30 PM - 4.30 PM"}},{"day":"TUESDAY","slot0":{"teacher_id":1,"subject_id":1,"slot_timing":"9.00 AM - 10.00 AM"},"slot1":{"teacher_id":3,"subject_id":3,"slot_timing":"10.00 AM - 11.00 AM"},"slot2":{"teacher_id":1,"subject_id":1,"slot_timing":"11.00 AM - 12.00 PM"},"slot3":{"teacher_id":4,"subject_id":4,"slot_timing":"12.00 PM - 1.00 PM"},"slot4":{"teacher_id":-1,"subject_id":-1,"slot_timing":"1.00 PM - 1.30 PM"},"slot5":{"teacher_id":4,"subject_id":4,"slot_timing":"1.30 PM - 2.30 PM"},"slot6":{"teacher_id":5,"subject_id":2,"slot_timing":"2.30 PM - 3.30 PM"},"slot7":{"teacher_id":2,"subject_id":5,"slot_timing":"3.30 PM - 4.30 PM"}},{"day":"WEDNESDAY","slot0":{"teacher_id":1,"subject_id":1,"slot_timing":"9.00 AM - 10.00 AM"},"slot1":{"teacher_id":3,"subject_id":3,"slot_timing":"10.00 AM - 11.00 AM"},"slot2":{"teacher_id":5,"subject_id":2,"slot_timing":"11.00 AM - 12.00 PM"},"slot3":{"teacher_id":4,"subject_id":4,"slot_timing":"12.00 PM - 1.00 PM"},"slot4":{"teacher_id":-1,"subject_id":-1,"slot_timing":"1.00 PM - 1.30 PM"},"slot5":{"teacher_id":4,"subject_id":4,"slot_timing":"1.30 PM - 2.30 PM"},"slot6":{"teacher_id":5,"subject_id":2,"slot_timing":"2.30 PM - 3.30 PM"},"slot7":{"teacher_id":2,"subject_id":5,"slot_timing":"3.30 PM - 4.30 PM"}},{"day":"THURSDAY","slot0":{"teacher_id":1,"subject_id":1,"slot_timing":"9.00 AM - 10.00 AM"},"slot1":{"teacher_id":3,"subject_id":3,"slot_timing":"10.00 AM - 11.00 AM"},"slot2":{"teacher_id":5,"subject_id":2,"slot_timing":"11.00 AM - 12.00 PM"},"slot3":{"teacher_id":4,"subject_id":4,"slot_timing":"12.00 PM - 1.00 PM"},"slot4":{"teacher_id":-1,"subject_id":-1,"slot_timing":"1.00 PM - 1.30 PM"},"slot5":{"teacher_id":2,"subject_id":5,"slot_timing":"1.30 PM - 2.30 PM"},"slot6":{"teacher_id":5,"subject_id":2,"slot_timing":"2.30 PM - 3.30 PM"},"slot7":{"teacher_id":2,"subject_id":5,"slot_timing":"3.30 PM - 4.30 PM"}},{"day":"FRIDAY","slot0":{"teacher_id":1,"subject_id":1,"slot_timing":"9.00 AM - 10.00 AM"},"slot1":{"teacher_id":3,"subject_id":3,"slot_timing":"10.00 AM - 11.00 AM"},"slot2":{"teacher_id":5,"subject_id":2,"slot_timing":"11.00 AM - 12.00 PM"},"slot3":{"teacher_id":4,"subject_id":4,"slot_timing":"12.00 PM - 1.00 PM"},"slot4":{"teacher_id":-1,"subject_id":-1,"slot_timing":"1.00 PM - 1.30 PM"},"slot5":{"teacher_id":2,"subject_id":5,"slot_timing":"1.30 PM - 2.30 PM"},"slot6":{"teacher_id":3,"subject_id":3,"slot_timing":"2.30 PM - 3.30 PM"},"slot7":{"teacher_id":2,"subject_id":5,"slot_timing":"3.30 PM - 4.30 PM"}}]';
    this.timeSheetData =  JSON.parse(data);
    this.getSlotTimngs();
  }

  getSlotTimngs() {
    const slots = this.timeSheetData[0];
    for (const key in slots) {
      if (Object.prototype.hasOwnProperty.call(slots, key) && key.indexOf('slot') > -1) {
        const element = slots[key];
        this.timings.push(element.slot_timing)
      }
    }
  }

}
