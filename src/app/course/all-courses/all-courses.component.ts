import { InstructorService } from '../../generalServices/instructor.service';
import { StudentService } from './../../generalServices/student.service';
import { CourseService } from './../course.service';
import { Component, OnInit } from '@angular/core';
import { ICourses } from '../icourses';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { PageEvent } from '@angular/material/paginator';

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
  pagedCourses: any[] = [];
  pageSize = 3;
  startIndex!: number;
  endIndex!: number;

  constructor(
    private courseService: CourseService,
    private studentService: StudentService,
    private snackBar: MatSnackBar,
    private instructorService: InstructorService
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      const helper = new JwtHelperService();
      const decodedToken = helper.decodeToken(token);
      const userId = decodedToken.nameid;
      this.studentId = userId;

      // Fetch all courses first
      this.courseService.getAllCourses().subscribe((courses) => {
        this.studentService.getStudentById(userId).subscribe((std) => {
          this.allCourses = courses.filter(
            (course) => !std.courseIDs.includes(course.id)
          );
          // Initialize pagedCourses with the first set of courses
          this.pagedCourses = this.allCourses.slice(0, this.pageSize);
        });
      });
    }
  }
  filterCourses(searchTerm: any) {
    // Filter courses based on search term
    const filteredCourses = this.allCourses.filter(course =>
      course.name.toLowerCase().includes(searchTerm.value.toLowerCase())
    );
  
    // Update pagedCourses with filtered data
    this.pagedCourses = filteredCourses.slice(0, this.pageSize);
  }

  onPageChange(event: PageEvent) {
    this.startIndex = event.pageIndex * event.pageSize;
    this.endIndex = this.startIndex + event.pageSize;
    this.pagedCourses = this.allCourses.slice(this.startIndex, this.endIndex);
  }
  enroll(courseId: number) {
    this.courseService.getCourseById(courseId).subscribe((course) => {
      let courseName: string = course.name;

      this.instructorService
        .getInstructorForSpecificCourse(courseName)
        .subscribe((instructorId) => {
          if (typeof instructorId === 'number') {
            this.instructorService
              .addNewCourse(this.studentId, course, instructorId)
              .subscribe(
                () => {
                  this.showSnackbar(`Successfully enrolled in ${courseName}`);
                  // Update enrolledCourses array after successful enrollment
                  this.enrolledCourses.push(course);
                  // Filter out the enrolled courses from allCourses array again
                  this.allCourses = this.allCourses.filter(
                    (c) => c.id !== course.id
                  );
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
