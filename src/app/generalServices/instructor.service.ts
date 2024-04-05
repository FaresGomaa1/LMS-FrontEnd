import { ErrorHandlerService } from './../generalServices/error-handler.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, retry } from 'rxjs';
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
  addInstructor(instructor: FormData) {
    const url = `${this.domainName}/Instructor/`;
    return this.http.post(url, instructor).pipe(
      catchError((error) => {
        this.errorHandlerService.handleError(error);
        throw error;
      })
    );
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
    console.log("addNewCourse",studentId,newCourses, instructorId)
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const body = JSON.stringify({
      courseId: newCourses.id,
      instructorId: instructorId,
    });
    return this.http.post(
      `${this.domainName}/Student/addCourse/${+studentId}`,
      body,
      {
        headers: headers,
      }
    );
  }

  getInstructorForSpecificCourse(courseName: string): Observable<number> {
    return this.getAllInstructors().pipe(
      map((allInstructors) => {
        let instructorId: number = 0;
        for (let i = 0; i < allInstructors.length; i++) {
          for (let j = 0; j < allInstructors[i].courseName.length; j++) {
            if (allInstructors[i].courseName[j] === courseName) {
              instructorId = allInstructors[i].id;
              console.log("getInstructorForSpecificCourse",instructorId)
              return instructorId; 
            }
          }
        }
        return instructorId; 
      })
    );
  }
}
