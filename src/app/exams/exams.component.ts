// exams.component.ts
import { Component, OnInit } from '@angular/core';
import { ExamService } from './exam.service';
import { IExam } from './iexam';
import { Observable } from 'rxjs';
import { ICourses } from './ICourses';

@Component({
  selector: 'app-exams',
  templateUrl: './exams.component.html',
  styleUrls: ['./exams.component.scss'],
})
export class ExamsComponent implements OnInit {
  exams: IExam[] | undefined;
  courses: ICourses[] = [];

  constructor(private examService: ExamService) {}

  ngOnInit(): void {
    this.getData();
    this.getAllCourses();
  }

  getData() {
    this.examService.getAllData().subscribe((data) => {
      this.exams = data;
      console.log(this.exams);
    });
  }

  getAllCourses() {
    this.examService.getAllCourses().subscribe((data) => {
      this.courses = data;
      console.log(this.courses);
    });
  }

  // getCourseNameById(courseId: number): string {
  //   const course = this.courses.find((c) => c.id === courseId);
  //   console.log('any');
  //   return course ? course.name : 'No Exam For This Course Now';
  // }

  // getCourseByName(courseName: string): string {
  //   const course = this.courses.find((c) => c.name === courseName);

  //   return course ? course.name : 'Unknown';
  // }
}
