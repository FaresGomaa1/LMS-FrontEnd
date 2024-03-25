import { Component } from '@angular/core';
import { Iquestions } from './iquestions';
import { ExamService } from '../exams/exam.service';
import { ExamquestionsService } from './examquestions.service';

@Component({
  selector: 'app-student-exam-form',
  templateUrl: './student-exam-form.component.html',
  styleUrls: ['./student-exam-form.component.scss'],
})
export class StudentExamFormComponent {
  examquestion: Iquestions[] | undefined;
  constructor(private examquestservices: ExamquestionsService) {}

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.examquestservices.getAll().subscribe((data) => {
      this.examquestion = data;
      console.log(this.examquestion);
    });
  }
}
