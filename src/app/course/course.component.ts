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
  studentCourseIds: number[] = [1];

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.getAllCourses();
  }

  getAllCourses(): void {
    this.courseService.getAllCourses().subscribe((courses: ICourses[]) => {
      this.courses = courses.filter(course => this.studentCourseIds.includes(course.id));
    });
  }

  openCourseDetailsInNewTab(courseId: number): void {
    const url = `http://localhost:4200/coursedetails/${courseId}`;
    window.open(url, '_blank');
  }
}
