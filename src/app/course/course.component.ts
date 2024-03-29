import { IStudent } from './../Interfaces/istudent';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Component, OnInit } from '@angular/core';
import { ICourses } from './icourses';
import { StudentService } from './../generalServices/student.service';
import { CourseService } from './course.service';
import { ICourse } from '../instructor/interface/i-course';

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

  constructor(
    private courseService: CourseService,
    private studentService: StudentService
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
  enroll(courseId: number) {
    const token = localStorage.getItem(this.tokenKey);

    if (token) {
      const helper = new JwtHelperService();
      const decodedToken = helper.decodeToken(token);
      const userId = decodedToken.nameid;

      // Retrieve the student by ID
      this.studentService.getStudentById(userId).subscribe((student: IStudent) => {
        // Retrieve the course by ID
        this.courseService.getCourseById(courseId).subscribe((course: ICourse) => {
          // Add the course to the student's courseName array
          if (!student.courseName) {
            student.courseName = []; // Initialize the array if it doesn't exist
          }
          student.courseName.push(course.name);

          // Update the student's information
          this.studentService.updateStudent(student).subscribe((updatedStudent: IStudent) => {
            console.log('Student enrolled successfully:', updatedStudent);
            // Handle any success logic here
          }, error => {
            console.error('Error updating student:', error);
            // Handle error logic here
          });
        }, error => {
          console.error('Error retrieving course:', error);
          // Handle error logic here
        });
      }, error => {
        console.error('Error retrieving student:', error);
        // Handle error logic here
      });
    } else {
      console.error('No token found');
      // Handle error logic here
    }
  }
  openCourseDetailsInNewTab(courseId: number): void {
    const url = `http://localhost:4200/coursedetails/${courseId}`;
    window.open(url, '_blank');
  }
}
