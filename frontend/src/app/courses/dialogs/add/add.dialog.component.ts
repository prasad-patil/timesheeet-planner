import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Component, Inject} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import { CoursesService } from '../../courses.service';
import { Issue, Course } from '../../Courses.model';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'app-add.dialog',
  templateUrl: '../../dialogs/add/add.dialog.html',
  styleUrls: ['../../dialogs/add/add.dialog.css']
})

export class AddDialogComponent {
  sems = [1, 2];
  course_year = [1,2,3,4];
  constructor(public dialogRef: MatDialogRef<AddDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Course,
              private notificationService: NotificationService,
              public courseService: CoursesService) { }

  formControl = new FormControl('', [
    Validators.required
    // Validators.email,
  ]);

  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Required field' : '';
  }

  submit() {
    this.courseService.saveCourse(this.data).subscribe(({course_id, course_name, course_sem, course_year})=>{
      let course: Course = {
        course_id,
        course_name,
        course_sem,
        course_year
      }
      this.courseService.addCourse(course);
      this.dialogRef.close(1);
      // this.notificationService.showSuccess('Course has been updated successfully!')
    }, err => {
      this.notificationService.showError('There was some error while updating course!')
    })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public confirmAdd(): void {
    this.courseService.addCourse(this.data);
  }
}
