import { IInstructor } from '../Interfaces/instructor';
import { InstructorService } from '../generalServices/instructor.service';
import { IStudent } from '../Interfaces/istudent';
import { StudentService } from '../generalServices/student.service';
import { ICourse } from '../instructor/interface/i-course';
import { CourseService } from '../course/course.service';
import { Component, OnInit } from '@angular/core';
import { ICourses } from '../course/icourses';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  tokenKey = 'auth_token';
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
      for (let i = 0; i < 3; i++) {
        this.allCourses.push(courses[i]);
      }
    });
    this.InstructorService.getAllInstructors().subscribe((ins) => {
      this.allInstructors = ins;
    });
  }
  checkEnrollment(id: number) {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      const helper = new JwtHelperService();
      const decodedToken = helper.decodeToken(token);
      const userId = decodedToken.nameid;
      this.studentService.getStudentById(userId).subscribe((std) => {
        if (std.courseIDs.includes(id)) {
          this.router.navigate(['/coursedetails', id]);
        } else {
          this.router.navigate(['/nonEnrolledCourses', id]);
        }
      });
    }
  }
  
}
