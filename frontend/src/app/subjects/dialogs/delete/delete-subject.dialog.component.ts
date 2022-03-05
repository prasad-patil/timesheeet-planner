import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Component, Inject} from '@angular/core';
import { SubjectsService } from '../../subjects.service';


@Component({
  selector: 'app-delete.dialog',
  templateUrl: '../../dialogs/delete/delete-subject.dialog.html',
  styleUrls: ['../../dialogs/delete/delete-subject.dialog.css']
})
export class DeleteSubjectDialogComponent {

  constructor(public dialogRef: MatDialogRef<DeleteSubjectDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, public subjectService: SubjectsService) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmDelete(): void {
    this.subjectService.deleteSubject(this.data.subject_id).subscribe(()=>{
      this.dialogRef.close(1);
    });
  }
}
