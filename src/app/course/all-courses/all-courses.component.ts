import { StudentService } from './../../generalServices/student.service';
import { CourseService } from './../course.service';
import { Component, OnInit } from '@angular/core';
import { ICourses } from '../icourses';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Component({
  selector: 'app-all-courses',
  templateUrl: './all-courses.component.html',
  styleUrls: ['./all-courses.component.scss'],
})
export class AllCoursesComponent implements OnInit {
  tokenKey = 'auth_token';
  allCourses: ICourses[] = [];
  student: any;
  studentId: number = 0;
  studentCourseIds: number[] = [];
  enrolledCourses: ICourses[] = [];

  constructor(
    private courseService: CourseService,
    private studentService: StudentService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      const helper = new JwtHelperService();
      const decodedToken = helper.decodeToken(token);
      const userId = decodedToken.nameid;
      this.studentId = userId;
      this.studentService.getStudentById(userId).subscribe((std) => {
        this.student = std;
        this.studentCourseIds = [...std.courseIDs];
        const otherStudentCourseIds = JSON.parse(
          localStorage.getItem(`course${userId}`) || '[]'
        );
        this.studentCourseIds.push(...otherStudentCourseIds);
        this.studentCourseIds = [...new Set(this.studentCourseIds)];

        this.courseService.getAllCourses().subscribe((courses) => {
          this.allCourses = courses;

          this.enrolledCourses = this.allCourses.filter((course) =>
            this.studentCourseIds.includes(course.id)
          );

          this.allCourses = this.allCourses.filter(
            (course) => !this.studentCourseIds.includes(course.id)
          );
        });
      });
    }
  }

  enroll(courseId: number) {
    if (this.student) {
      let studentCourseIdsString = localStorage.getItem(
        `course${this.student.id}`
      );
      if (studentCourseIdsString !== null) {
        this.studentCourseIds = JSON.parse(studentCourseIdsString);
      } else {
        this.studentCourseIds = [];
      }

      if (!this.studentCourseIds.includes(courseId)) {
        this.studentCourseIds.push(courseId);
        this.showSnackbar('Enrolled successfully!');
        localStorage.setItem(
          `course${this.student.id}`,
          JSON.stringify(this.studentCourseIds)
        );
      } else {
        this.showSnackbar('You are Already Enrolled in this Course!');
      }
    } else {
      // Handle case where student is not defined
    }
  }

  showSnackbar(message: string): void {
    const config: MatSnackBarConfig = {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['custom-snackbar'], // Apply custom class
    };

    this.snackBar.open(message, 'Dismiss', config);
  }
}