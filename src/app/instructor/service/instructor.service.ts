import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICourse } from '../interface/i-course';
import { IInstructor } from '../interface/i-instructor'; // Import the instructor interface
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
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


  
}
