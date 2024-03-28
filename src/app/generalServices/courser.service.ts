import { Injectable } from '@angular/core';
import { ICourse } from '../instructor/interface/i-course';
import { Observable, catchError, retry } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class CourserService {
  domainName: string = 'http://localhost:5050';
  constructor(
    private http: HttpClient,
    private errorHandlerService: ErrorHandlerService
  ) { }
  getAllInstructors(): Observable<ICourse[]> {
    return this.http.get<ICourse[]>(`${this.domainName}/Courses`).pipe(
      retry(2),
      catchError(this.errorHandlerService.handleError)
    );
  }
}
