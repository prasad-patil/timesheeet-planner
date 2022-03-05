import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SubjectTeacher } from './subject-teacher.model';

@Injectable({
  providedIn: 'root'
})
export class SubjectTeacherDataService {

  private readonly API_URL = 'http://localhost:3000/';
  dataChange: BehaviorSubject<SubjectTeacher[]> = new BehaviorSubject<SubjectTeacher[]>([]);

  constructor(private httpClient: HttpClient) { }

  get data(): SubjectTeacher[] {
    return this.dataChange.value;
  }
  getSubjectTeacher(course_id: number): void {
    this.getSubjectTeacher$(course_id).subscribe(data => {
        this.dataChange.next(data);
      },
      (error: HttpErrorResponse) => {
      console.log (error.name + ' ' + error.message);
      });
  }

  getSubjectTeacher$(id: number) {
    return this.httpClient.get<SubjectTeacher[]>(`${this.API_URL}retirveSubjectTeacherByCourse/${id}`);
  }
}
