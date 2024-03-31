import { InstructorService } from './../../generalServices/instructor.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from './../course.service';
import { ICourses } from '../icourses';
import { IInstructor } from 'src/app/instructor/interface/i-instructor';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';


@Component({
  selector: 'app-none-enrolled-courses',
  templateUrl: './none-enrolled-courses.component.html',
  styleUrls: [
    './none-enrolled-courses.component.scss',
    '../course-details/course-details.component.scss',
  ],
})
export class NoneEnrolledCoursesComponent {
  tokenKey = 'auth_token';
  selectedCourse!: ICourses;
  instructor!: IInstructor | undefined;
  studentId!: number;
  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private router: Router,
    private instructorService: InstructorService,
    private snackBar: MatSnackBar,
  ) {}
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const courseId = Number(params.get('id'));
      if (courseId) {
        this.getCourseDetails(courseId);
      } else {
        this.router.navigateByUrl('/not-found');
      }
    });
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      const helper = new JwtHelperService();
      const decodedToken = helper.decodeToken(token);
      const userId = decodedToken.nameid;
      this.studentId = userId;
    }
  }

  getCourseDetails(courseId: number): void {
    this.courseService.getCourseById(courseId).subscribe((course: ICourses) => {
      this.selectedCourse = course;
      this.getInstructorToCourse();
    });
  }
  getInstructorToCourse(): void {
    this.instructorService
      .getAllInstructors()
      .subscribe((instructors: IInstructor[]) => {
        this.instructor = instructors.find((instructor) =>
          instructor.courseName.includes(this.selectedCourse.name)
        );
      });
  }
  enroll(selectedCourseId: number) {
    // Retrieve studentCourseIds from localStorage
    let studentCourseIdsString = localStorage.getItem(
      `course${this.studentId}`
    );

    // Check if studentCourseIdsString is not null before parsing
    if (studentCourseIdsString !== null) {
      let studentCourseIds: number[] = JSON.parse(studentCourseIdsString);
      studentCourseIds.push(selectedCourseId);
      this.showSnackbar('Enrolled successfully!');
      localStorage.setItem(`course${this.studentId}`,JSON.stringify(studentCourseIds))
      this.router.navigateByUrl('/shared/course');
    } else {
      
    }
  }
  showSnackbar(message: string): void {
    const config: MatSnackBarConfig = {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['custom-snackbar'],
    };

    this.snackBar.open(message, 'Dismiss', config);
  }
}
