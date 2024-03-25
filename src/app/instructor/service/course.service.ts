import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICourse } from '../interface/i-course';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  baseURL: string = "http://localhost:5050";
  constructor(private http: HttpClient) { }

  getAllCourses(): Observable<ICourse[]> {
    return this.http.get<ICourse[]>(`${this.baseURL}/Courses`)
  }
  getCourseById(ID: number): Observable<ICourse> {
    return this.http.get<ICourse>(`${this.baseURL}/Courses/${ID}`)
  }

  getCourseByName(name:string): Observable<ICourse> {
    return this.http.get<ICourse>(`${this.baseURL}/Courses/${name}`)
  }
}
