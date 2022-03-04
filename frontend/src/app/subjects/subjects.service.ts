import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, forkJoin, map, merge, Observable, throwError } from 'rxjs';
import { Course } from '../courses/Courses.model';
import { Subject } from './subject.models';

@Injectable({
  providedIn: 'root'
})
export class SubjectsService {

  private readonly API_URL = 'http://localhost:3000/';

  dataChange: BehaviorSubject<Subject[]> = new BehaviorSubject<Subject[]>([]);
  // Temporarily stores data from dialogs
  dialogData: any;

  constructor (private httpClient: HttpClient) {}

  get data(): Subject[] {
    return this.dataChange.value;
  }

  getDialogData() {
    return this.dialogData;
  }

  getSubjects() {
    this.getSubject$().subscribe((sub: Subject[])=>{
      this.dataChange.next(sub);
    });
  }

  getSubject$() {
    return forkJoin([this.httpClient.get(`${this.API_URL}subjects`), this.httpClient.get(`${this.API_URL}courses`)]).pipe(
      map((results: Array<any>)=> {
        let subjects: Subject[] = [];
        (results[0] as Array<any>).forEach(sub => {
          sub = {...sub, course: this.getCourseById(results[1], sub.course_id)};
          subjects.push(sub);
        });
        return subjects;
      }),
      catchError(err => {
        console.log('Handling error locally and rethrowing it...', err);
        return throwError(err);
      })
    )
  }

  private getCourseById(course: Course[], id: number): Course | undefined {
    return course.find(course => course.course_id === id)
  }

  // DEMO ONLY, you can find working methods below
  addSubject (subject: Subject): void {
    this.dialogData = subject;
  }

  updateSubject (subject: Subject): void {
    this.dialogData = subject;
  }

  deleteSubject (id: number): Observable<Subject> {
    return this.httpClient.delete<Subject>(`${this.API_URL}subjects/${id}`);
  }

  saveSubject(subject: any) {
    let data = {
      name: subject.name,
      course_id: subject.course
    }
    return this.httpClient.post(`${this.API_URL}subjects`, data);
  }
  editSubject(subject: any): Observable<Subject> {
    return this.httpClient.put<Subject>(`${this.API_URL}subjects/${subject.subject_id}`, subject);
  }
}
