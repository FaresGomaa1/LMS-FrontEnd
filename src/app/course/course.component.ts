import { StudentService } from './../generalServices/student.service';
import { CourseService } from './course.service';
import { Component, OnInit } from '@angular/core';
import { ICourses } from './icourses';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss'],
})
export class CourseComponent implements OnInit {
  courses: ICourses[] = [];
  selectedCourse: ICourses | null = null;
  studentCourseNames: string[] = [];

  constructor(
    private courseService: CourseService,
    private StudentService: StudentService
  ) {}

  ngOnInit(): void {
    this.getAllCourses();
    this.getStudentCourse();
  }
  getAllCourses(): void {
    this.courseService.getAllCourses().subscribe((courses: ICourses[]) => {
      this.courses = courses.filter((course) =>
        this.studentCourseNames.includes(course.name)
      );
    });
  }
  getStudentCourse() {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.StudentService.getStudentById(parseInt(userId, 10)).subscribe(
        (student) => {
          this.studentCourseNames = student.courseName;
          console.log(student);
          console.log(this.studentCourseNames)
        }
      );
    } else {
      console.error('userId not found in local storage');
    }
  }
  openCourseDetailsInNewTab(courseId: number): void {
    const url = `http://localhost:4200/coursedetails/${courseId}`;
    window.open(url, '_blank');
  }
}
