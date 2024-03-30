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
    console.log(  this.studentId)
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
            let studentCourseIdsString = localStorage.getItem(`course${userId}`);
            if (studentCourseIdsString !== null) {
              this.studentCourseIds = JSON.parse(studentCourseIdsString);
            } else {
              // this.studentCourseIds = this.studentCourseIds;
              localStorage.setItem(
                `course${userId}`,
                JSON.stringify(this.studentCourseIds)
              );
            }

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
    let studentCourseIdsString = localStorage.getItem(`course${this.studentId}`);
    if (studentCourseIdsString !== null) {
      this.studentCourseIds = JSON.parse(studentCourseIdsString);
    } else {
      // this.studentCourseIds = this.studentCourseIds;
    }
  
    for (let i = 0; i < this.studentCourseIds.length; i++) {
      if (courseId === this.studentCourseIds[i]) {
        alert('You are already enrolled in this course');
        return;
      }
    }  
    this.studentCourseIds.push(courseId);
    localStorage.setItem(
      `course${this.studentId}`,
      JSON.stringify(this.studentCourseIds)
    );
    alert("Enrolled Sucssfully")
  }
  
  openCourseDetailsInNewTab(courseId: number): void {
    const url = `http://localhost:4200/coursedetails/${courseId}`;
    window.open(url, '_blank');
  }
}
