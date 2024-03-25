import { ErrorHandlerService } from './../generalServices/error-handler.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { Observable, catchError, retry } from 'rxjs';
import { IStudent } from '../Interfaces/istudent';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
domainName: string = "http://localhost:5050";
  constructor(
    private http: HttpClient,
    private errorHandlerService: ErrorHandlerService
  ) { }
  getAllStudents(): Observable<IStudent[]> {
    return this.http.get<IStudent[]>(`${this.domainName}/Student`).pipe(
      retry(2),
      catchError(this.errorHandlerService.handleError)
    );
  }
  getStudentById(ID: number): Observable<IStudent> {
    return this.http.get<IStudent>(`${this.domainName}/Student/${ID}`).pipe(
      retry(2),
      catchError(this.errorHandlerService.handleError)
    );
  }
}
