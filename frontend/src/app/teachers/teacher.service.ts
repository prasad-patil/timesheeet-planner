import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, forkJoin, map, merge, Observable, throwError } from 'rxjs';
import { Course } from '../courses/Courses.model';
import { Subject } from '../subjects/subject.models';
import { SubjectsService } from '../subjects/subjects.service';
import { Teacher } from './teacher.model';

@Injectable({
  providedIn: 'root'
})
export class TeachersService {

  private readonly API_URL = 'http://localhost:3000/';

  dataChange: BehaviorSubject<Teacher[]> = new BehaviorSubject<Teacher[]>([]);
  // Temporarily stores data from dialogs
  dialogData: any;

  constructor (private httpClient: HttpClient, private subjectservice: SubjectsService) {}

  get data(): Teacher[] {
    return this.dataChange.value;
  }

  getDialogData() {
    return this.dialogData;
  }

  getTeachers() {
    forkJoin([this.httpClient.get(`${this.API_URL}teachers`), this.subjectservice.getSubject$()]).pipe(
      map((results: Array<any>)=> {
        let teachers: Teacher[] = [];
        (results[0] as Array<any>).forEach(teacher => {
          teacher = {...teacher, subject: this.getSubjectById(results[1], teacher.teacher_id)};
          teachers.push(teacher);
        });
        return teachers;
      }),
      catchError(err => {
        console.log('Handling error locally and rethrowing it...', err);
        return throwError(err);
      })
    ).subscribe((teacher: Teacher[])=>{
      this.dataChange.next(teacher);
    });
  }

  private getSubjectById(subjects: Subject[], id: number): Subject | undefined {
    return subjects.find(sub => sub.subject_id === id)
  }

  addTeacher (teacher: Teacher): void {
    this.dialogData = teacher;
  }

  updateTeacher (teacher: Teacher): void {
    this.dialogData = teacher;
  }

  deleteTeacher (id: number): Observable<Teacher> {
    return this.httpClient.delete<Teacher>(`${this.API_URL}teachers/${id}`);
  }

  saveTeacher (teacher: any) {
    let data = {
      firstname: teacher.firstname,
      lastname: teacher.lastname,
      subject_id: teacher.subject_id
    }
    return this.httpClient.post(`${this.API_URL}teachers`, data);
  }

  editTeacher (teacher: any): Observable<Teacher> {
    return this.httpClient.put<Teacher>(`${this.API_URL}teachers/${teacher.teacher_id}`, teacher);
  }
}
