import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import { NotificationService } from 'src/app/shared/notification.service';
import { TeachersService } from '../../teacher.service';
import { Subject } from 'src/app/subjects/subject.models';
import { SubjectsService } from 'src/app/subjects/subjects.service';
import { Teacher } from '../../teacher.model';

@Component({
  selector: 'add-subject.dialog',
  templateUrl: '../../dialogs/add/add-teacher.dialog.html',
  styleUrls: ['../../dialogs/add/add-teacher.dialog.css']
})

export class AddTeacherDialogComponent implements OnInit{
  subjects: Subject[] =[];

  constructor(public dialogRef: MatDialogRef<AddTeacherDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private notificationService: NotificationService,
              private subjectService: SubjectsService,
              public teacherService: TeachersService) { }

  formControl = new FormControl('', [
    Validators.required
    // Validators.email,
  ]);

  ngOnInit(): void {
      this.subjectService.getSubject$().subscribe((subjects: Subject[])=>{
        this.teacherService.getTeacher$().subscribe((teachers)=>{
          const availableSubjects = subjects.filter((sub)=> this.isSubjectNotAssigned(teachers, sub.subject_id))
          this.subjects = availableSubjects;
        });
      });
  }

  isSubjectNotAssigned(teachers: Teacher[], subjectId: number) {
    if (teachers.length == 0) {
      return true;
    }
    return teachers.find((teacher: Teacher)=> {
      if (teacher.subject) {
        return teacher.subject.subject_id !== subjectId;
      }
      return false;
    });
  }

  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Required field' :
      this.formControl.hasError('email') ? 'Not a valid email' :
        '';
  }

  submit() {
    this.teacherService.saveTeacher(this.data).subscribe((data: any)=>{
      let subject = this.subjects.find(sub=> sub.subject_id === this.data.subject_id);
      let teacher: Teacher = {
        teacher_id: data.teacher_id,
        firstname: data.firstname,
        lastname: data.lastname,
        subject: subject || new Subject()
      }
      this.teacherService.addTeacher(teacher);
      this.dialogRef.close(1);
    }, (err: any) => {
      console.log(err)
      this.notificationService.showError('There was some error while creating teacher !');
    })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

