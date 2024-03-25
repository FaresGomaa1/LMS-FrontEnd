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
  exams: IExam[] = [];
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
      console.log(this.exams.length);
      this.getCourseNameById();
    });
  }

  getCourseNameById(): void {
    console.log(this.exams.length);
    for (let i = 0; i < this.exams?.length; i++) {
      this.courseIds.push(this.exams[i].course_ID);
    }
    for (let i = 0; i < this.courseIds.length; i++) {
      this.examService.getById(this.courseIds[i]).subscribe((course) => {
        this.courses.push(course.name);
      });
    }
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
