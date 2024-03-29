import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICourse } from '../interface/i-course';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  baseURL: string = "http://localhost:5050/Courses";
  constructor(private http: HttpClient) { }

  getAllCourses(): Observable<ICourse[]> {
    return this.http.get<ICourse[]>(`${this.baseURL}`)
  }
  getCourseById(ID: number): Observable<ICourse> {
    return this.http.get<ICourse>(`${this.baseURL}/${ID}`)
  }

  getCourseByName(name:string): Observable<ICourse> {
    return this.http.get<ICourse>(`${this.baseURL}/${name}`)
  }

  addCourse(course: ICourse, instructorId: number): Observable<ICourse> {
    return this.http.post<ICourse>(`${this.baseURL}`, course, { params: { instructorId: instructorId.toString() } });
  }
 
 
  updateCourse(course: ICourse , id : number): Observable<any> {
    return this.http.put(`${this.baseURL}/${id}`, course );
  }

  deleteCourse(ID: number): Observable<ICourse> {
    return this.http.delete<ICourse>(`${this.baseURL}/${ID}` );
  }
}
