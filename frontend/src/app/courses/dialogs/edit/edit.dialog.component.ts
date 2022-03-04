import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Component, Inject} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import { CoursesService } from '../../courses.service';
import { Course } from '../../Courses.model';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'app-baza.dialog',
  templateUrl: '../../dialogs/edit/edit.dialog.html',
  styleUrls: ['../../dialogs/edit/edit.dialog.css']
})
export class EditDialogComponent {
  sems = [1, 2];
  course_year = [1,2,3,4];

  constructor(public dialogRef: MatDialogRef<EditDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, public courseService: CoursesService, public notificationService: NotificationService) { }

  formControl = new FormControl('', [
    Validators.required
    // Validators.email,
  ]);

  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Required field' :
      this.formControl.hasError('email') ? 'Not a valid email' :
        '';
  }

  submit() {
    // emppty stuff
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  save(): void {
    this.courseService.editCourse(this.data).subscribe(({course_id, course_name, course_sem, course_year})=>{
      let course: Course = {
        course_id,
        course_name,
        course_sem,
        course_year
      }
      this.courseService.updateCourse(course);
      // this.notificationService.showSuccess('Course has been updated successfully!')
    }, err => {
      this.notificationService.showError('There was some error while updating course!')
    })
  }
}
