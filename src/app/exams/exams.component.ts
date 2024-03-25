import { StudentService } from './../generalServices/student.service';
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
  exams: IExam[] = [];
  courses: string[] = [];
  courseIds: number[] = [];
  constructor(
    private examService: ExamService,
    private StudentService: StudentService
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    const studentId = localStorage.getItem("userId");
    if (studentId) {
      this.StudentService.getStudentById(parseInt(studentId)).subscribe((student) => {
        const examNames = student.examName;
        this.examService.getAllData().subscribe((data) => {
          this.exams = data.filter((exam) => examNames.includes(exam.name));
          this.getCourseNameById();
        });
      });
    }
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
}
