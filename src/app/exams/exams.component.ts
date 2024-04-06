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
  studentExamIds: number[] = [];
  courseIds: number[] = [];
  studentExams: IExam[] = [];
  studentSolvedExams: IExam[] = [];
  Result: any[] = [];
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
      this.studentExamIds = std.examIDs;
      this.getExams();
      this.getStudentResults();
    });
  }
  getStudentResults() {
    this.studentService.getStudentById(this.studentId).subscribe((std) => {
      for (let i = 0; i < std.examIDs.length; i++) {
        this.examService.getExamById(std.examIDs[i]).subscribe((exam) => {
          this.studentSolvedExams.push(exam);
          if (std.results[i] < exam.min_Degree) {
            this.Result.push(`Failed ${std.results[i]}`);
          } else {
            this.Result.push(`Passed ${std.results[i]}`);
          }
        });
      }
    });
  }
  getExams() {
    this.examService.getAllExam().subscribe((allExams) => {
      // Filter out exams that are not in studentExamIds
      const newExams = allExams.filter(exam => !this.studentExamIds.includes(exam.id));
  
      // Push filtered exams into studentExams
      newExams.forEach(newExam => {
        for (let i = 0; i < this.courseIds.length; i++) {
          if (newExam.course_ID === this.courseIds[i]) {
            if (this.examService.isExamDatePassed(newExam.date, newExam.time, newExam.duration)) {
              this.studentExams.push(newExam);
              break; // No need to check for other courseIds once exam is pushed
            }
          }
        }
      });
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
      currentDate.getDate() < examDate.getDate()
    ) {
      return false;
    } else if (
      currentDate.getFullYear() == examDate.getFullYear() ||
      currentDate.getMonth() + 1 == examDate.getMonth() + 1 ||
      currentDate.getDate() == examDate.getDate()
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
