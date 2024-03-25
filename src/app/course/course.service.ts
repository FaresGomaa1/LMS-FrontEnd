import { ErrorHandlerService } from './../generalServices/error-handler.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { Observable, catchError, retry } from 'rxjs';
import { ICourses } from './icourses';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  domainName: string = "http://localhost:5050";
  constructor(
    private http: HttpClient,
    private errorHandlerService: ErrorHandlerService
  ) { }

  getAllCourses(): Observable<ICourses[]> {
    return this.http.get<ICourses[]>(`${this.domainName}/Courses`).pipe(
      retry(2),
      catchError(this.errorHandlerService.handleError)
    );
  }
  getCourseById(ID: number): Observable<ICourses> {
    return this.http.get<ICourses>(`${this.domainName}/Courses/${ID}`).pipe(
      retry(2),
      catchError(this.errorHandlerService.handleError)
    );
  }
}