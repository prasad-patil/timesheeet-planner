import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GenerateTimeSheetService {

  private readonly API_URL = 'http://localhost:3000/';
  public timetableData: any;

  constructor (private httpClient: HttpClient) {}

  generateTimeSheet(data: any) {
    return this.httpClient.post<any>(`${this.API_URL}generateTimeSheetController`, data).pipe(
      tap((data)=> this.timetableData = data)
    );
  }
}
