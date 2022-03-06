import { DataSource } from '@angular/cdk/collections';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { fromEvent, BehaviorSubject, Observable, merge, map } from 'rxjs';
import { NotificationService } from 'src/app/shared/notification.service';
import { SubjectTeacherDataService } from './subject-teacher-data.service';
import { SubjectTeacher } from './subject-teacher.model';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { CoursesService } from 'src/app/courses/courses.service';
import { Course } from 'src/app/courses/Courses.model';
import { GenerateTimeSheetService } from '../generate-timesheet/generate-timesheet.service';
import { Router } from '@angular/router';
import { TimesheetService } from '../timesheet.service';

interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-teacher-subject-display',
  templateUrl: './teacher-subject-display.component.html',
  styleUrls: ['./teacher-subject-display.component.scss']
})
export class TeacherSubjectDisplayComponent implements OnInit {
  displayedColumns = ['subject_name', 'teacher_name', 'hours'];
  subjectTeacherDatabase: SubjectTeacherDataService;
  dataSource: SubjectTeacherDataSource;
  index: number;
  id: number;
  hours: any = {};
  totalHours = 0;
  MAX_HOURS = 35;
  previousGeneratedTimeTables: number[] =[];
  showPreviousGeneratedWarningInfo: boolean = false;

  constructor(private httpClient: HttpClient,
              public teacherSubjectService: SubjectTeacherDataService,
              public notifcationService: NotificationService,
              private courseService: CoursesService,
              private genetateTimeSheetService: GenerateTimeSheetService,
              private timetableService: TimesheetService,
              private router: Router) { }
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  selectedCourseId: number;

  courses: Course[]


  ngOnInit(): void {
    this.courseService.getCoursesFromDB().subscribe((courses: Course[])=>{
      this.courses = courses;
    });
    this.timetableService.getAllTimeSheets$().subscribe((timesheets)=> timesheets && timesheets.forEach((timesheet: any)=>{
      this.previousGeneratedTimeTables.push(timesheet.course_id)
    }));
  }

  public loadData(course_id: number) {
    this.subjectTeacherDatabase = new SubjectTeacherDataService(this.httpClient);
    this.dataSource = new SubjectTeacherDataSource(this.subjectTeacherDatabase, this.sort, course_id);
  }

  onCourseSelected() {
    this.showPreviousGeneratedWarningInfo = false;
    this.loadData(this.selectedCourseId);
    if (this.selectedCourseId) {
      this.showPreviousGeneratedWarningInfo = this.previousGeneratedTimeTables.indexOf(this.selectedCourseId) > -1;
    }
  }

  onChange() {
    this.totalHours = 0;
    for (const hr in this.hours) {
      if (Object.prototype.hasOwnProperty.call(this.hours, hr)) {
        const element = this.hours[hr];
        this.totalHours = this.totalHours + element;
      }
    }
  }

  onGenerateTimeTableClick() {
    const data: any = {};
    data.course_id = this.selectedCourseId;
    data.total_hours = this.totalHours;
    data.periods = [];
    const teacherSubjectData = this.dataSource.renderedData;
    teacherSubjectData.forEach((teacherSubject, index)=>{
      data.periods.push({
        teacher_id: teacherSubject.teacher?.teacher_id,
        subject_id: teacherSubject.subject_id,
        hours: this.hours[index]
      })
    })
    this.genetateTimeSheetService.generateTimeSheet(data).subscribe((timeTabledata)=>{
      console.log(timeTabledata);
      this.router.navigate(['/view-timetable', this.selectedCourseId])
    });
  }

}

export class SubjectTeacherDataSource extends DataSource<SubjectTeacher> {
  course_id: number;


  renderedData: SubjectTeacher[] = [];

  constructor(public subjectTeacherService: SubjectTeacherDataService,
              public _sort: MatSort,
              course_id: number) {
    super();
    this.course_id = course_id;
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<SubjectTeacher[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this.subjectTeacherService.dataChange,
      this._sort.sortChange
    ];

    this.subjectTeacherService.getSubjectTeacher(this.course_id);


    return merge(...displayDataChanges).pipe(map( () => {
        const sortedData = this.sortData(this.subjectTeacherService.data.slice());
        this.renderedData = sortedData;
        return this.renderedData;
      }
    ));
  }

  disconnect() {}


  /** Returns a sorted copy of the database data. */
  sortData(data: SubjectTeacher[]): SubjectTeacher[] {
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';

      switch (this._sort.active) {
        case 'subject_name': [propertyA, propertyB] = [a.name, b.name]; break;
        case 'teacher_name': [propertyA, propertyB] = [a.teacher ? a.teacher?.firstname : '', b.teacher ? b.teacher.firstname : '']; break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
    });
  }
}

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
