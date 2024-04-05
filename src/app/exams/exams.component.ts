import { ConvertTimeService } from './../generalServices/conver-time.service';
import { IExam } from './iexam';
import { StudentService } from './../generalServices/student.service';
import { ExamService } from './exam.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-exams',
  templateUrl: './exams.component.html',
  styleUrls: ['./exams.component.scss'],
})
export class ExamsComponent implements OnInit {
  studentId!: number;
  examIds: number[] = [];
  courseIds: number[] = [];
  studentExams: IExam[] = [];
  constructor(
    private router: Router,
    private examService: ExamService,
    private studentService: StudentService,
    private convertTimeService: ConvertTimeService
  ) {}
  ngOnInit(): void {
    this.getStudent();
  }
  getStudent() {
    this.studentId = this.examService.getStudentId();
    this.studentService.getStudentById(this.studentId).subscribe((std) => {
      this.courseIds = std.courseIDs;
      this.getExams();
    });
  }

  getExams() {
    this.examService.getAllExam().subscribe((allExams) => {
      for (let i = 0; i < allExams.length; i++) {
        for (let j = 0; j < this.courseIds.length; j++) {
          if (allExams[i].course_ID === this.courseIds[j]) {
            if (this.examService.isExamDatePassed(allExams[i].date, allExams[i].time, allExams[i].duration)){
              this.studentExams.push(allExams[i]);
            }
          }
        }
      }
    });
  }
  startExam(examId: number): void {
    this.router.navigate(['instructions', examId]);
  }
  checkFullDate(examId: number): boolean {
    // let actionColumn = document.getElementById('action' + index);
    let exam = this.studentExams.find((exam) => exam.id === examId);
    if (!exam) {
      return false;
    }
    let currentDate = new Date();
    let examDate = new Date(exam.date);
    let examTime = exam.time.split(':');
    let currentHours = currentDate.getHours();
    let currentMins = currentDate.getMinutes();
    let currentSecs = currentDate.getSeconds();
    let examHours = +examTime[0];
    let examMins = +examTime[1];
    let examSecs = +examTime[2];
    let currentTimeInMins = this.convertTimeService.convertTimeToMin(
      currentHours,
      currentMins,
      currentSecs
    );
    let examTimeInMins = this.convertTimeService.convertTimeToMin(
      examHours,
      examMins,
      examSecs
    );
    let examEndTime = examTimeInMins + exam.duration;
    if (
      currentDate.getFullYear() < examDate.getFullYear() ||
      currentDate.getMonth() + 1 < examDate.getMonth() + 1 ||
      currentDate.getDay() < examDate.getDay()
    ) {
      return false;
    } else if (
      currentDate.getFullYear() == examDate.getFullYear() ||
      currentDate.getMonth() + 1 == examDate.getMonth() + 1 ||
      currentDate.getDay() == examDate.getDay()
    ) {
      if (currentTimeInMins < examTimeInMins) {
        return false;
      } else if (currentTimeInMins < examEndTime) {
        return true;
      }
    }
    return false;
  }
}
