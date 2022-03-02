import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Course, Issue } from './Courses.model';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  private readonly API_URL = 'http://localhost:3000/';

  dataChange: BehaviorSubject<Course[]> = new BehaviorSubject<Course[]>([]);
  // Temporarily stores data from dialogs
  dialogData: any;

  constructor (private httpClient: HttpClient) {}

  get data(): Course[] {
    return this.dataChange.value;
  }

  getDialogData() {
    return this.dialogData;
  }

  getAllCourses(): void {
    this.httpClient.get<Course[]>(`${this.API_URL}courses`).subscribe(data => {
        this.dataChange.next(data);
      },
      (error: HttpErrorResponse) => {
      console.log (error.name + ' ' + error.message);
      });
  }

  // DEMO ONLY, you can find working methods below
  addCourse (course: Course): void {
    this.dialogData = course;
  }

  updateCourse (course: Course): void {
    this.dialogData = course;
  }

  deleteCourse (id: number): void {
    console.log(id);
  }
}
