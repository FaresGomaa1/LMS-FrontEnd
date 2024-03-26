import { StudentService } from './../generalServices/student.service';
import { Component, OnInit } from '@angular/core';
import { ExamService } from './exam.service';
import { IExam } from './iexam';
import { Observable, forkJoin } from 'rxjs';
import { ICourses } from './ICourses';
import { JwtHelperService } from '@auth0/angular-jwt';
import { switchMap, map } from 'rxjs/operators';

@Component({
  selector: 'app-exams',
  templateUrl: './exams.component.html',
  styleUrls: ['./exams.component.scss'],
})
export class ExamsComponent implements OnInit {
  tokenKey = 'auth_token';
  exams: IExam[] = [];
  courses: string[] = [];

  constructor(
    private examService: ExamService,
    private studentService: StudentService
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      const helper = new JwtHelperService();
      const decodedToken = helper.decodeToken(token);
      const userId = decodedToken.nameid;
      if (userId) {
        this.studentService.getStudentById(parseInt(userId, 10)).pipe(
          switchMap(student => {
            const examObservables: Observable<IExam>[] = student.examIDs.map(examId =>
              this.examService.getExamById(examId)
            );
            return forkJoin(examObservables);
          })
        ).subscribe(
          exams => {
            this.exams = exams;
            this.getCourseNames();
          },
          error => {
            console.error('Error fetching exams:', error);
          }
        );
      }
    }
  }

  getCourseNames(): void {
    const courseIds = this.exams.map(exam => exam.course_ID);
    const courseObservables: Observable<ICourses>[] = courseIds.map(courseId =>
      this.examService.getById(courseId)
    );
    forkJoin(courseObservables).subscribe(
      courses => {
        this.courses = courses.map(course => course.name);
      }
    );
  }
}
