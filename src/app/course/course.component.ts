import { IStudent } from './../Interfaces/istudent';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Component, OnInit } from '@angular/core';
import { ICourses } from './icourses';
import { StudentService } from './../generalServices/student.service';
import { CourseService } from './course.service';
import { InstructorService } from './../generalServices/instructor.service';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss'],
})
export class CourseComponent implements OnInit {
  tokenKey = 'auth_token';
  courses: ICourses[] = [];
  studentCourseIds: number[] = [];
  enrollInNewCourses: ICourses[] = [];
  instructorId!: number;
  studentId!: number;

  constructor(
    private courseService: CourseService,
    private studentService: StudentService,
    private instructorService: InstructorService
  ) {
    this.courseService.getAllCourses().subscribe((courses) => {
      this.enrollInNewCourses = courses;
    });
  }

  ngOnInit(): void {
    this.getStudentCourseIds();
  }

  getStudentCourseIds(): void {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      const helper = new JwtHelperService();
      const decodedToken = helper.decodeToken(token);
      const userId = decodedToken.nameid;
      this.studentId = userId;
      if (userId) {
        this.studentService
          .getStudentById(parseInt(userId, 10))
          .subscribe((student) => {
            this.studentCourseIds = student.courseIDs;
            this.getAllStudentCourses();
          });
      } else {
        console.error('User ID not found in decoded token');
      }
    } else {
      console.error('Token not found in local storage');
    }
  }

  getAllStudentCourses(): void {
    this.courseService.getAllCourses().subscribe(
      (courses) => {
        this.courses = courses.filter((course) =>
          this.studentCourseIds.includes(course.id)
        );
      },
      (error) => {
        console.error('Failed to fetch courses:', error);
      }
    );
  }
  
  openCourseDetailsInNewTab(courseId: number): void {
    const url = `http://localhost:4200/coursedetails/${courseId}`;
    window.open(url, '_blank');
  }
}
