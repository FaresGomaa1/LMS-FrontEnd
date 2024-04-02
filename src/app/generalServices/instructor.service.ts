import { ErrorHandlerService } from './../generalServices/error-handler.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, retry } from 'rxjs';
import { IInstructor } from '../Interfaces/instructor';
import { ICourses } from '../course/icourses';

@Injectable({
  providedIn: 'root',
})
export class InstructorService {
  domainName: string = 'http://localhost:5050';
  constructor(
    private http: HttpClient,
    private errorHandlerService: ErrorHandlerService
  ) {}
  getAllInstructors(): Observable<IInstructor[]> {
    return this.http
      .get<IInstructor[]>(`${this.domainName}/Instructor`)
      .pipe(retry(2), catchError(this.errorHandlerService.handleError));
  }
  getInstructorById(id: number): Observable<IInstructor[]> {
    return this.http
      .get<IInstructor[]>(`${this.domainName}/Instructor/${id}`)
      .pipe(retry(2), catchError(this.errorHandlerService.handleError));
  }
  addNewCourse(
    studentId: number,
    newCourses: ICourses,
    instructorId: number
  ): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const body = JSON.stringify({
      studentId: studentId,
      courseName: [newCourses.name],
      instructorIDs: [instructorId],
    });
    return this.http.post(`${this.domainName}/Student/addCourse`, body, {
      headers: headers,
    });
  }

  getInstructorForSpecificCourse(
    courseName: string
  ): Observable<number | boolean> {
    return new Observable<number | boolean>((observer) => {
      this.getAllInstructors().subscribe((allInstructors) => {
        let instructorId: number | null = null;
        for (let j = 0; j < allInstructors.length; j++) {
          for (let k = 0; k < allInstructors[j].courseName.length; k++) {
            if (courseName === allInstructors[j].courseName[k]) {
              instructorId = allInstructors[j].id;
              observer.next(instructorId);
              observer.complete();
              return;
            }
          }
        }

        observer.next(false);
        observer.complete();
      });
    });
  }
}
