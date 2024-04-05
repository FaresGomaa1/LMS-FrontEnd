import { ErrorHandlerService } from './../generalServices/error-handler.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, retry } from 'rxjs';
import { ICourses } from './icourses';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  domainName: string = 'http://localhost:5050';
  constructor(
    private http: HttpClient,
    private errorHandlerService: ErrorHandlerService
  ) {}

  getAllCourses(): Observable<ICourses[]> {
    return this.http
      .get<ICourses[]>(`${this.domainName}/Courses`)
      .pipe(retry(2), catchError(this.errorHandlerService.handleError));
  }
  getCourseById(ID: number): Observable<ICourses> {
    return this.http
      .get<ICourses>(`${this.domainName}/Courses/${ID}`)
      .pipe(retry(2), catchError(this.errorHandlerService.handleError));
  }
  isCourseEndDatePassed(courseDate: Date): boolean {
    let currentDate = new Date();
    let courseDate1 = new Date(courseDate);
    if (currentDate.getFullYear() > courseDate1.getFullYear()) {
      return false;
    } else if (currentDate.getMonth() + 1 > courseDate1.getMonth() + 1) {
      return false;
    } else if (currentDate.getDate() > courseDate1.getDate()) {
      return false;
    } else {
      return true;
    }
  }
}
