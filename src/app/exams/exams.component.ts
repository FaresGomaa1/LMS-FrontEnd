import { Component, OnInit } from '@angular/core';
import { ExamService } from './exam.service';
import { StudentService } from './../generalServices/student.service';
import { IExam } from './iexam';
import { ICourses } from './ICourses';
import { Observable, forkJoin } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { switchMap } from 'rxjs/operators';
import { Router } from '@angular/router'; // Import Router

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
    private studentService: StudentService,
    private router: Router
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
        this.studentService
          .getStudentById(parseInt(userId, 10))
          .pipe(
            switchMap((student) => {
              const examObservables: Observable<IExam>[] = student.examIDs.map(
                (examId) => this.examService.getExamById(examId)
              );
              return forkJoin(examObservables);
            })
          )
          .subscribe(
            (exams) => {
              this.exams = exams;
              this.getCourseNames();
            },
            (error) => {
              console.error('Error fetching exams:', error);
            }
          );
      }
    }
  }

  getCourseNames(): void {
    const courseIds = this.exams.map((exam) => exam.course_ID);
    const courseObservables: Observable<ICourses>[] = courseIds.map(
      (courseId) => this.examService.getById(courseId)
    );
    forkJoin(courseObservables).subscribe((courses) => {
      this.courses = courses.map((course) => course.name);
    });
  }

  checkTodayDate(index: number): boolean {
    const currentDate = new Date();
    const exam = this.exams[index];
    if (!exam) {
      return false; 
    }

    const examDate = new Date(exam.date);
    const currentDateString = currentDate.toDateString();
    const examDateString = examDate.toDateString();

    return currentDateString === examDateString;
  }

  startExam(index: number): void {
    const examId: number = this.exams[index].id;
    this.router.navigate(['/instructions', examId]);
  }
}
