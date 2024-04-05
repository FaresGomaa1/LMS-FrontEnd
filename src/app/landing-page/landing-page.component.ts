import { IInstructor } from '../Interfaces/instructor';
import { InstructorService } from '../generalServices/instructor.service';
import { StudentService } from '../generalServices/student.service';
import { CourseService } from '../course/course.service';
import { Component, OnInit } from '@angular/core';
import { ICourses } from '../course/icourses';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent {
  allCourses: ICourses[] = [];
  allInstructors: IInstructor[] = [];
  constructor(
    private courserService: CourseService,
    private studentService: StudentService,
    private InstructorService: InstructorService,
    private router: Router,
  ) {}
  ngOnInit(): void {
    this.courserService.getAllCourses().subscribe((courses) => {
      for (let i = 0; i < courses.length; i++) {
        if (this.courserService.isCourseEndDatePassed(courses[i].end_Date)) {
          this.allCourses.push(courses[i]);
          if(this.allCourses.length === 3){
            break;
          }
        }
      }
    });
    this.InstructorService.getAllInstructors().subscribe((ins) => {
      this.allInstructors = ins;
    });
  }
  checkEnrollment(id: number) {
    this.router.navigate(['/nonEnrolledCourses', id]);
  }
}
