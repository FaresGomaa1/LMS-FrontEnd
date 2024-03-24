import { Component, OnInit } from '@angular/core';
import { ExamService } from './exam.service';
import { IExam } from './iexam';

@Component({
  selector: 'app-exams',
  templateUrl: './exams.component.html',
  styleUrls: ['./exams.component.scss'],
})
export class ExamsComponent implements OnInit {
  Exam: IExam[] | undefined;
  constructor(private Examservices: ExamService) {}

  ngOnInit(): void {
    this.getData();
  }
  getData() {
    this.Exam;
    this.Examservices.getAllData().subscribe((data) => {
      this.Exam = data;
    });
  }
}
