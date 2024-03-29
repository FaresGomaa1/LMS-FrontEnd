import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICourse } from '../interface/i-course';
import { IInstructor } from '../interface/i-instructor'; 
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription, switchMap } from 'rxjs';
import { ICourses } from 'src/app/exams/ICourses';

@Injectable({
  providedIn: 'root'
})
export class InstructorService {
  baseURL :string = 'http://localhost:5050/Instructor';
 

  constructor(private HttpClient :HttpClient ) { }


  getAllData(): Observable<IInstructor[]> {
    return this.HttpClient.get<IInstructor[]>(this.baseURL);
  }

  getById(id: number): Observable<IInstructor> {
    return this.HttpClient.get<IInstructor>(`${this.baseURL}/${id}`);
  }
  Update(id: number,instructor:IInstructor ): Observable<IInstructor> {
    return this.HttpClient.put<IInstructor>(`${this.baseURL}/${id}`, instructor);
  }

  

  addCourseToInstructor(instructorId: number, course: ICourse): Observable<IInstructor> {
    return this.HttpClient.post<IInstructor>(`${this.baseURL}/${instructorId}/Courses`, course);
  }

  updateInstructorCourses(instructorId: number, courseName: string): Observable<IInstructor> {
    return this.getById(instructorId).pipe(
      switchMap((instructor: IInstructor) => {
        instructor.courseName.push(courseName); 
        return this.Update(instructorId, instructor);  
      })
    );
  }

 
}
