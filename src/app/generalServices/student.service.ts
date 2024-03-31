import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, tap } from 'rxjs';
import { IStudent } from '../Interfaces/istudent';
import { IStudent1 } from '../Interfaces/student-for-add';

import { ErrorHandlerService } from './../generalServices/error-handler.service';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  domainName: string = 'http://localhost:5050';
  newStudentAdded: any;

  constructor(
    private http: HttpClient,
    private errorHandlerService: ErrorHandlerService
  ) {}

  getAllStudents(): Observable<IStudent[]> {
    return this.http
      .get<IStudent[]>(`${this.domainName}/Student`)
      .pipe(catchError(this.errorHandlerService.handleError));
  }

  getStudentById(ID: number): Observable<IStudent> {
    return this.http
      .get<IStudent>(`${this.domainName}/Student/${ID}`)
      .pipe(catchError(this.errorHandlerService.handleError));
  }

  updateStudent(student: any): Observable<IStudent> {
    return this.http
      .put<IStudent>(`${this.domainName}/Student/${student.id}`, student)
      .pipe(catchError(this.errorHandlerService.handleError));
  }

  getById(Id: number) {
    return this.http
      .get<IStudent1>(`${this.domainName}/Student/${Id}`)
      .pipe(catchError(this.errorHandlerService.handleError));
  }
  addStudent(student: any): Observable<any> {
    return this.http.post<any>(`${this.domainName}/Student`, student);
  }

  Add(student: FormData) {
    const url = `${this.domainName}/Student/`;
    return this.http.post(url, student)
      .pipe(
        catchError(error => {
          this.errorHandlerService.handleError(error);
          throw error;
        })
      );
  }

  Edit(id: number, studentFormData: FormData): Observable<any> {
    const url = `${this.domainName}/Student/${id}`;
    return this.http.put(url, studentFormData)
      .pipe(
        catchError(error => {
          this.errorHandlerService.handleError(error);
          throw error;
        })
      );
  }
}
