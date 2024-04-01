import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
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

//   Add(course: FormData) {
//     return this.http
//         .post(this.baseURL, course)
//         .pipe(
//             tap(() => {
//                 this.newCourseAdded.next();
//             })
//         );
// }
  getCourseByName(name: string): Observable<ICourse[]> {
    const params = new HttpParams().set('name', name);
    return this.http.get<ICourse[]>(this.baseURL, { params });
  }

  // addCourse(course: ICourse, instructorId: number): Observable<ICourse> {
  //   return this.http.post<ICourse>(this.baseURL, course, { params: { instructorId: instructorId.toString() } });
  // }

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

  getCourseEnrolledStudentsCount(courseName: string): Observable<number> {
    return this.getAllStudents().pipe(
      map(students => {
        let count = 0;
        students.forEach(student => {
          if (student.courseName && student.courseName.includes(courseName)) {
            count++;
          }
        });
        return count;
      }),
      catchError(error => {
        console.error('Failed to get students:', error);
        return of(0); // Return an observable emitting 0 in case of error
      })
    );
  }}