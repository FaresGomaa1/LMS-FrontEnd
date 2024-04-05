import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ICourse } from '../interface/i-course';
import { IStudent } from '../interface/istudent';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  baseURL: string = "http://localhost:5050/Courses";

  constructor(private http: HttpClient) { }

  getAllCourses(): Observable<ICourse[]> {
    return this.http.get<ICourse[]>(this.baseURL);
  }

  getCourseById(id: number): Observable<ICourse> {
    return this.http.get<ICourse>(`${this.baseURL}/${id}`);
  }

 
  getCourseByName(name: string): Observable<ICourse[]> {
    const params = new HttpParams().set('name', name);
    return this.http.get<ICourse[]>(this.baseURL, { params });
  }

  

  addCourse(course: FormData, instructorId: number): Observable<ICourse> {
    // Append instructorId as a query parameter
    const params = new HttpParams().set('instructorId', instructorId.toString());
    return this.http.post<ICourse>(this.baseURL, course, { params });
  }
  updateCourse(course: ICourse, id: number): Observable<ICourse> {
    return this.http.put<ICourse>(`${this.baseURL}/${id}`, course);
  }

  deleteCourse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseURL}/${id}`);
  }

  getAllStudents(): Observable<IStudent[]> { 
    return this.http.get<IStudent[]>(`http://localhost:5050/Student`);
  }

  getCourseEnrolledStudentsCount(id: number): Observable<number> {
    return this.getAllStudents().pipe(
      map(students => {
        let count = 0;
        students.forEach(student => {
          if (student.courseIDs && student.courseIDs.includes(id)) {
            count++;
          }
        });
        return count;
      }),
      catchError(error => {
        console.error('Failed to get students:', error);
        return throwError(error); // Forward the error downstream
      })
    );
  }

  getStudentsByCourseId(courseId: number): Observable<IStudent[]> {
    const url = `http://localhost:5050/Student?courseId=${courseId}`;  
    return this.http.get<IStudent[]>(url);
  }
 
  getCourseEnrolledStudentsDetails(courseId: number): Observable<IStudent[]> {
    return this.getStudentsByCourseId(courseId).pipe(
      catchError(error => {
        console.error('Failed to get students:', error);
        return [];
      })
    );
  }


}