import { ErrorHandlerService } from './../generalServices/error-handler.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, retry } from 'rxjs';
import { IInstructor } from '../Interfaces/instructor';

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
  getInstructorForSpecificCourse(courseNames: string[]): number[] {
    let instructorIds: number[] = [];
    this.getAllInstructors().subscribe((allInstructors) => {
      for (let i = 0; i < courseNames.length; i++) {
        for (let j = 0; j < allInstructors.length; j++) {
          for (let k = 0; k < allInstructors[j].courseName.length; k++) {
            if (courseNames[i] === allInstructors[j].courseName[k]) {
              instructorIds.push(allInstructors[j].id);
            }
          }
        }
      }
    });
    return instructorIds;
  }
}
