import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GenerateTimeSheetService {

  private readonly API_URL = 'http://localhost:3000/';

  constructor (private httpClient: HttpClient) {}

  generateTimeSheet(data: any) {
    return this.httpClient.post<any>(`${this.API_URL}generateTimeSheetController`, data);
  }
}
