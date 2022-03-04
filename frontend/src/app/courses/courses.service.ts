import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
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
    this.getCoursesFromDB().subscribe(data => {
        this.dataChange.next(data);
      },
      (error: HttpErrorResponse) => {
      console.log (error.name + ' ' + error.message);
      });
  }

  getCoursesFromDB() {
    return this.httpClient.get<Course[]>(`${this.API_URL}courses`);
  }

  // DEMO ONLY, you can find working methods below
  addCourse (course: Course): void {
    this.dialogData = course;
  }

  updateCourse (course: Course): void {
    this.dialogData = course;
  }

  deleteCourse (id: number): Observable<Course> {
    return this.httpClient.delete<Course>(`${this.API_URL}courses/${id}`);
  }

  editCourse(course: Course): Observable<Course> {
    return this.httpClient.put<Course>(`${this.API_URL}courses/${course.course_id}`, course);
  }

  saveCourse(course: Course): Observable<Course> {
    return this.httpClient.post<Course>(`${this.API_URL}courses`, course);
  }
}
