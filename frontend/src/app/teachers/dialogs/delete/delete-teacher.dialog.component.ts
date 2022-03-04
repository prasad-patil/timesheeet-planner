import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Component, Inject} from '@angular/core';
import { TeachersService } from '../../teacher.service';


@Component({
  selector: 'app-delete.dialog',
  templateUrl: '../../dialogs/delete/delete-teacher.dialog.html',
  styleUrls: ['../../dialogs/delete/delete-teacher.dialog.css']
})
export class DeleteTeacherDialogComponent {

  constructor(public dialogRef: MatDialogRef<DeleteTeacherDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, public teacherService: TeachersService) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmDelete(): void {
    this.teacherService.deleteTeacher(this.data.teacher_id).subscribe(()=>{
      this.dialogRef.close(1);
    });
  }
}
