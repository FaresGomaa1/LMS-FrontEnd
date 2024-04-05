import { InstructorService } from './../../generalServices/instructor.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from './../course.service';
import { ICourses } from '../icourses';
import { IInstructor } from '../../Interfaces/instructor';
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
    private snackBar: MatSnackBar
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
  enroll(courseId: number) {
    this.courseService.getCourseById(courseId).subscribe((course) => {
      let courseName: string = course.name;
  
      // Get the instructorId asynchronously
      this.instructorService.getInstructorForSpecificCourse(courseName).subscribe((instructorId) => {
        console.log(this.studentId, course.id, instructorId);
        if (typeof instructorId === 'number') {
          this.instructorService
            .addNewCourse(this.studentId, course, instructorId)
            .subscribe(
              () => {
                this.showSnackbar(`Successfully enrolled in ${courseName}`);
                // Use backticks for string interpolation
                this.router.navigate([`/coursedetails/${courseId}`]);
              },
              (error) => {
                console.error('Error enrolling course:', error);
              }
            );
        } else {
          console.error('Instructor ID not found for course:', courseName);
        }
      });
    });
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
