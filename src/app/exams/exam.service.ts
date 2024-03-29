// exam.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IExam } from './iexam';
import { Observable } from 'rxjs';
import { ICourses } from './ICourses';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class ExamService {
  tokenKey = 'auth_token';
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

  getStudentId(): number {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      const helper = new JwtHelperService();
      const decodedToken = helper.decodeToken(token);
      return decodedToken.nameid; 
    }
    return 0;
  }

  checkIfResultExist() {
    const studentId = this.getStudentId();
    const regexPattern = new RegExp(`^result${studentId}:.*$`);
  
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && regexPattern.test(key)) {
        const result = localStorage.getItem(key);
        if (result !== null && result !== '0') {
          return parseInt(result, 10);
        }
      }
    }
    
    return false;
  }
  
  
}