import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import { NotificationService } from 'src/app/shared/notification.service';
import { CoursesService } from 'src/app/courses/courses.service';
import { Course } from 'src/app/courses/Courses.model';
import { SubjectsService } from 'src/app/subjects/subjects.service';
import { TeachersService } from '../../teacher.service';
import { Subject } from 'src/app/subjects/subject.models';
import { Teacher } from '../../teacher.model';

@Component({
  selector: 'edit-subject.dialog',
  templateUrl: '../../dialogs/edit/edit-teacher.dialog.html',
  styleUrls: ['../../dialogs/edit/edit-teacher.dialog.css']
})

export class EditTeacherDialogComponent implements OnInit{
  subjects: Subject[] =[];
  availbleSubjects: Subject[] = [];
  constructor(public dialogRef: MatDialogRef<EditTeacherDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private notificationService: NotificationService,
              public subjectService: SubjectsService,
              public teacherService: TeachersService) { }

  formControl = new FormControl('', [
    Validators.required
    // Validators.email,
  ]);

  ngOnInit(): void {
    this.subjectService.getSubject$().subscribe((subjects: Subject[])=>{
      this.teacherService.getTeacher$().subscribe((teachers)=>{
        // const availableSubjects = subjects.filter((sub)=> this.isSubjectNotAssigned(teachers, sub.subject_id))
        this.subjects = subjects;
        let assignSubjects: number[] = [];
        let availableSubjects: Subject[] = [];
        teachers.forEach(teacher=> {
          if(teacher.subject) {
            assignSubjects.push(teacher.subject.subject_id);
          }
        });
        subjects.forEach((subject)=>{
          if (assignSubjects.indexOf(subject.subject_id) == -1 || this.data.subject_id === subject.subject_id) {
            availableSubjects.push(subject);
          }
        })
        this.availbleSubjects = availableSubjects;
      });
    });
  }
  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Required field' : '';
  }

  submit() {
    this.teacherService.editTeacher(this.data).subscribe((data: any)=>{
      let subject = this.subjects.find(sub=> sub.subject_id === this.data.subject_id);
      let teacher: Teacher = {
        teacher_id: data.teacher_id,
        firstname: data.firstname,
        lastname: data.lastname,
        subject: subject || new Subject()
      }
      this.teacherService.updateTeacher(teacher);
      this.dialogRef.close(1);
    }, (err: any) => {
      console.log(err)
      this.notificationService.showError('There was some error while updating teaacher !')
    })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
