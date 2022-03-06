import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimesheetService {

  private readonly API_URL = 'http://localhost:3000/';
  dataChange: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  constructor(private httpClient: HttpClient) { }

  get data(): any[] {
    return this.dataChange.value;
  }

  getTimeSheetByCourseID(courseId: number): Observable<any> {
    return this.httpClient.get<any>(`${this.API_URL}timeSheets/${courseId}`);
  }

  getAllTimeSheets$() {
    return this.httpClient.get<any>(`${this.API_URL}timeSheets`)
    .pipe(tap(data=> this.dataChange.next(data)));
  }

  getAllTimeSheets() {
    this.getAllTimeSheets$().subscribe()
  }

  deleteTimesheet(course_id: number) {
    return this.httpClient.delete<any>(`${this.API_URL}timeSheets/${course_id}`);
  }
}
