// exam.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IExam } from './iexam';
import { Observable } from 'rxjs';
import { ICourses } from './ICourses';

@Injectable({
  providedIn: 'root',
})
export class ExamService {
  baseUrl: string = 'http://localhost:5050/Exam';
  baseUrl2: string = 'http://localhost:5050/Courses';

  constructor(private http: HttpClient) {}

  getAllData(): Observable<IExam[]> {
    return this.http.get<IExam[]>(this.baseUrl);
  }

  getExamById(ID: number): Observable<IExam> {
    return this.http.get<IExam>(`${this.baseUrl}/${ID}`);
  }

  getById(id: number): Observable<ICourses> {
    return this.http.get<ICourses>(`${this.baseUrl2}/${id}`);
  }

  getAllCourses(): Observable<ICourses[]> {
    return this.http.get<ICourses[]>(this.baseUrl2);
  }
}