import { ErrorHandlerService } from './../../generalServices/error-handler.service';

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'; 
import { Observable, catchError, map, retry, switchMap } from 'rxjs';
import { IEvent } from '../interface/i-event';
import { InstructorService } from './instructor.service';
import { CourseService } from './course.service';
import { ICourse } from '../interface/i-course';


@Injectable({
  providedIn: 'root'
})
export class EventService {
  baseUrl: string = "http://localhost:5050";
  
  constructor(
    private http: HttpClient,
    private ErrorHandlerService: ErrorHandlerService,
    private instructorService: InstructorService,
    private courseService: CourseService
  ) { }
  getEvents(): Observable<IEvent[]>{
    return this.http.get<IEvent[]>(`${this.baseUrl}/Event`).pipe(
      retry(2),
      catchError(this.ErrorHandlerService.handleError)
    );
  }
  

   

  // Method to get courses by name
  getCourseByName(name: string): Observable<ICourse[]> {
    const params = new HttpParams().set('name', name);
    return this.http.get<ICourse[]>(this.baseUrl, { params });
  }

  // Method to get courses of an instructor by instructor id
  getInstructorCourses(id: number): Observable<ICourse[]> {
    return this.instructorService.getById(id)
      .pipe(
        switchMap(instructor => {
          if (instructor) {
            return this.courseService.getAllCourses()
              .pipe(
                map(courses => courses.filter(course => instructor.courseIDs.includes(course.id)))
              );
          }
          return [];
        })
      );
  }

  // Method to get events filtered by course names of an instructor
  getEventsByInstructorCourses(instructorId: number): Observable<IEvent[]> {
    return this.getInstructorCourses(instructorId)
      .pipe(
        switchMap(courses => {
          const coursesIDs = courses.map(course => course.id);
          return this.getAllEvents().pipe(
            map(events => events.filter(event => {
              return event.coursesIDs.some(id => coursesIDs.includes(id));
            }))
          );
        })
      );
  }
  getAllEvents(): Observable<IEvent[]> {
    return this.http.get<IEvent[]>(`${this.baseUrl}/Event`);
  }

  getEventsByCourseName(courseName: string): Observable<IEvent[]> { 
    return this.http.get<IEvent[]>(`${this.baseUrl}/Event?courseName=${courseName}`);
  }
}