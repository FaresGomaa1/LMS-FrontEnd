import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { Iquestions } from './iquestions';

@Injectable({
  providedIn: 'root',
})
export class ExamquestionsService {
  constructor(private http: HttpClient) {}
  baseURL: string = 'http://localhost:5050/Question';
  getAll() {
    return this.http.get<[Iquestions]>(this.baseURL);
  }
}
