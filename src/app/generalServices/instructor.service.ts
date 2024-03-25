import { ErrorHandlerService } from './../generalServices/error-handler.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { Observable, catchError, retry } from 'rxjs';
import { IInstructor } from '../instructor/interface/i-instructor';

@Injectable({
  providedIn: 'root'
})
export class InstructorService {
  domainName: string = "http://localhost:5050";
  constructor(
    private http: HttpClient,
    private errorHandlerService: ErrorHandlerService
  ) { }
  getAllInstructors(): Observable<IInstructor[]> {
    return this.http.get<IInstructor[]>(`${this.domainName}/Instructor`).pipe(
      retry(2),
      catchError(this.errorHandlerService.handleError)
    );
  }
}
