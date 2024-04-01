import { Injectable } from '@angular/core';
import { ICourse } from '../interface/i-course';
import { InstructorService } from 'src/app/instructor/service/instructor.service';
import { CourseService } from './course.service';
import { Observable, map, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InstructorCourseService {

  constructor(private instservice: InstructorService, private courseService: CourseService , private HttpClient : HttpClient) { }


  isInstructorCourse(instructorId: number, courseName: string): Observable<boolean> {
    return this.instservice.getById(instructorId)
      .pipe(
        map(instructor => {
          if (instructor && instructor.courseName.includes(courseName)) {
            return true;
          } else {
            return false;
          }
        })
      );
  }

  
  getInstructorCourses(id:number): Observable<ICourse[]> {
    return this.instservice.getById(id)
      .pipe(
        switchMap(instructor => {
          if (instructor) {
            return this.courseService.getAllCourses()
              .pipe(
                map(courses => courses.filter(course => instructor.courseName.includes(course.name)))
              );
          }
          return [];
        })
      );
  }

  



}
