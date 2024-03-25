// exams.component.ts
import { Component, OnInit } from '@angular/core';
import { ExamService } from './exam.service';
import { IExam } from './iexam';
import { Observable, forkJoin } from 'rxjs';
import { ICourses } from './ICourses';

@Component({
  selector: 'app-exams',
  templateUrl: './exams.component.html',
  styleUrls: ['./exams.component.scss'],
})
export class ExamsComponent implements OnInit {
  exams: IExam[]  = [];
  courses: string[] = [];
  courseIds: number[] = [];
  constructor(private examService: ExamService) {}

  ngOnInit(): void {
    this.getData();
    // this.getAllCourses();
  
  }

  getData() {
    this.examService.getAllData().subscribe((data) => {
      this.exams = data;
      this.getCourseNameById()
    });
  }

  getCourseNameById(): void {
    // Extract course IDs from exams
    const courseIds = this.exams.map(exam => exam.course_ID);
  
    // Array to store Observable for each HTTP request
    const observables = [];
  
    // Create Observables for each HTTP request
    for (const courseId of courseIds) {
      observables.push(this.examService.getById(courseId));
    }
  
    // Use forkJoin to make parallel HTTP requests
    forkJoin(observables).subscribe(
      (courses: ICourses[]) => {
        this.courses = courses.map(course => course.name);
      }
    );
  }
  

  // getAllCourses() {
  //   this.examService.getAllCourses().subscribe((data) => {
  //     this.courses = data;
  //   });
  // }

  // getCourseByName(courseName: string): string {
  //   const course = this.courses.find((c) => c.name === courseName);

  //   return course ? course.name : 'Unknown';
  // }
}
