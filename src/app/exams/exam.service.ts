import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IExam } from './iexam';

@Injectable({
  providedIn: 'root',
})
export class ExamService {
  baseUrl: string = 'http://localhost:5050/Exam';

  constructor(private http: HttpClient) {}

  getAllData() {
    console.log('any');
    return this.http.get<IExam[]>(`${this.baseUrl}`);
  }

  getById(id: number) {
    return this.http.get(`${this.baseUrl}/${id}`);
  }
}
