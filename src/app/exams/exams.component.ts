import { ConverTimeService } from './../generalServices/conver-time.service';
import { Component, OnInit } from '@angular/core';
import { ExamService } from './exam.service';
import { StudentService } from './../generalServices/student.service';
import { IExam } from './iexam';
import { ICourses } from './ICourses';
import { Observable, forkJoin } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';

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
    private router: Router,
    private ConverTimeService: ConverTimeService
  ) {}
getStudentId(){
  const token = localStorage.getItem(this.tokenKey);
        
  if(token){
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token);
     return decodedToken.nameid; 
  }
}
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
              console.log(this.exams);
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

  checkTodayDate(index: number): boolean | void {
    // Get current date and time
    const currentDate: Date = new Date();
    const currentDate1 = currentDate.getDate().toString();
    // Get the exam object at the specified index
    const exam = this.exams[index];
    const examD = new Date(exam.date)
    const examDate = examD.getDate().toString();
    // Convert current date and exam date to timestamps
    const currentTimestamp: number = currentDate.getTime(); // can't compare
    const examTimestamp: number = new Date(exam.date).getTime(); // can't compare

    // Extract exam time and duration
    const examTime: string = exam.time;
    const duration: number = exam.duration;
    // Check if current timestamp matches exam timestamp
    if ((currentDate.getMonth()+1) === (examD.getMonth()+1)){
      if (currentDate1 === examDate) {
        // Get the DOM element for the exam action
        const row = document.getElementById('action' + index);
        // Get current time in HH:MM:SS format
        const currentTime: string = `${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;
        const [hours1, minutes1, seconds1] = currentTime.split(':');
        const currentTimeInMins = this.ConverTimeService.convertTimeToMin(
          +hours1,
          +minutes1,
          +seconds1
        );
  
        // Split exam time into hours, minutes, and seconds
        const [hours, minutes, seconds] = examTime.split(':');
        // Convert exam time to minutes
        const examTimeInMins: number = this.ConverTimeService.convertTimeToMin(
          +hours,
          +minutes,
          +seconds
        );
        // Calculate exam end time based on duration
        const examEndTime = duration + examTimeInMins;
        // Check if current time matches exam start time
        if (currentTimeInMins === examTimeInMins) {
          return true;
        } else if (currentTimeInMins < examTimeInMins) {
          return false;
        } else if (
          currentTimeInMins > examTimeInMins &&
          examEndTime > currentTimeInMins
        ) {
          let examId = this.exams[index].id;
          if (`${examId}` === localStorage.getItem(`exam${examId}`)) {
            if (row) {
              if (
                this.examService.checkIfResultExist() ||
                this.examService.checkIfResultExist() === 0
              ) {
                row.innerHTML = `${localStorage.getItem(`result${this.getStudentId()}:${examId}`)}`;
                return;
              }
              row.innerHTML = `You Missed The Exam`;
              return;
            }
          } else {
            return true;
          }
        } else {
          // Display message if exam end time has passed
          if (row) {
            if (this.examService.checkIfResultExist()) {
              row.innerHTML = `${this.examService.checkIfResultExist()}`;
              return;
            }
            row.innerHTML = `You Missed The Exam`;
          }
        }
      } else if (currentDate1 > examDate) {
        // Current timestamp is after exam timestamp, exam has passed
        return false;
      } else {
        // Current timestamp is before exam timestamp, exam hasn't started yet
        const row = document.getElementById('action' + index);
        if (row) {
          if (this.examService.checkIfResultExist()) {
            row.innerHTML = `${this.examService.checkIfResultExist()}`;
            return;
          }
          row.innerHTML = `You Missed The Exam`;
        }
      }
    } else if ((currentDate.getMonth()+1) < (examD.getMonth()+1)) {
      return false;
    } else {
      const row = document.getElementById('action' + index);
      if (row) {
        row.innerHTML = `You Missed The Exam`;
      }
    }

  }

  startExam(index: number): void {
    const examId: number = this.exams[index].id;
    this.router.navigate(['/instructions', examId]);
  }
}
