import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { Observable, catchError } from 'rxjs';
import { IStudent } from '../Interfaces/istudent';
import { ErrorHandlerService } from './../generalServices/error-handler.service';

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
      catchError(this.errorHandlerService.handleError)
    );
  }

  getStudentById(ID: number): Observable<IStudent> {
    return this.http.get<IStudent>(`${this.domainName}/Student/${ID}`).pipe(
      catchError(this.errorHandlerService.handleError)
    );
  }
  
  updateStudent(student: any): Observable<IStudent> {
    return this.http.put<IStudent>(`${this.domainName}/Student/${student.id}`, student).pipe(
      catchError(this.errorHandlerService.handleError)
    );
  }

  addStudent(student :any): Observable<any> {
    return this.http.post<any>(`${this.domainName}/Student`, student)
  }
}