import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import { NotificationService } from 'src/app/shared/notification.service';
import { SubjectsService } from '../../subjects.service';
import { Subject } from '../../subject.models';
import { CoursesService } from 'src/app/courses/courses.service';
import { Course } from 'src/app/courses/Courses.model';

@Component({
  selector: 'edit-subject.dialog',
  templateUrl: '../../dialogs/edit/edit-subject.dialog.html',
  styleUrls: ['../../dialogs/edit/edit-subject.dialog.css']
})

export class EditSubjectDialogComponent implements OnInit{
  courses: Course[] =[];
  constructor(public dialogRef: MatDialogRef<EditSubjectDialogComponent>,
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
    return this.formControl.hasError('required') ? 'Required field' :
      this.formControl.hasError('email') ? 'Not a valid email' :
        '';
  }

  submit() {
    this.subjectService.editSubject(this.data).subscribe((data: any)=>{
      let course = this.courses.find(course=> course.course_id === this.data.course_id);
      let subject: Subject = {
        subject_id: data.subject_id,
        name: data.name,
        course: course || new Course()
      }
      this.subjectService.updateSubject(subject);
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
