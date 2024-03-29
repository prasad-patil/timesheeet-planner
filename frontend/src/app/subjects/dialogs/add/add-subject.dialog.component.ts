import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import { NotificationService } from 'src/app/shared/notification.service';
import { SubjectsService } from '../../subjects.service';
import { Subject } from '../../subject.models';
import { CoursesService } from 'src/app/courses/courses.service';
import { Course } from 'src/app/courses/Courses.model';

@Component({
  selector: 'add-subject.dialog',
  templateUrl: '../../dialogs/add/add-subject.dialog.html',
  styleUrls: ['../../dialogs/add/add-subject.dialog.css']
})

export class AddSubjectDialogComponent implements OnInit{
  courses: Course[] =[];

  constructor(public dialogRef: MatDialogRef<AddSubjectDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private notificationService: NotificationService,
              public subjectService: SubjectsService,
              public courseService: CoursesService) { }

  formControl = new FormControl('', [
    Validators.required
    // Validators.email,
  ]);

  ngOnInit(): void {
      this.courseService.getCoursesFromDB().subscribe((courses: Course[])=>{
        this.courses = courses;
      });
  }
  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Required field' : '';
  }

  submit() {
    this.subjectService.saveSubject(this.data).subscribe((data: any)=>{
      let course = this.courses.find(course=> course.course_id === this.data.course);
      let subject: Subject = {
        subject_id: data.subject_id,
        name: data.name,
        course: course || new Course()
      }
      this.subjectService.addSubject(subject);
      this.dialogRef.close(1);
    }, (err: any) => {
      console.log(err)
      this.notificationService.showError('There was some error while updating subject !')
    })
0  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

interface Food {
  value: string;
  viewValue: string;
}
