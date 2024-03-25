import { Injectable } from '@angular/core';
import { ICourse } from '../interface/i-course';
import { InstructorService } from 'src/app/instructor/service/instructor.service';
import { CourseService } from './course.service';
import { Observable, map, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InstructorCourseService {
  loggedInInstructorId: number = 1;

  constructor(private instservice: InstructorService, private courseService: CourseService) { }

  getInstructorCourses(): Observable<ICourse[]> {
    return this.instservice.getById(this.loggedInInstructorId)
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
