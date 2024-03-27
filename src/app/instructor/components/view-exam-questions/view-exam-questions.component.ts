
import { QuestionService } from 'src/app/instructor/service/question.service';
import { Component } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ExamService } from 'src/app/instructor/service/exam.service';
import { IExam } from 'src/app/exams/iexam';
import { IQuestion } from '../../interface/iquestion';

@Component({
  selector: 'app-view-exam-questions',
  templateUrl: './view-exam-questions.component.html',
  styleUrls: ['./view-exam-questions.component.scss']
})
export class ViewExamQuestionsComponent {
  exam_Id: number=0;
  exams: IExam[] | undefined;
  questions : IQuestion[] | undefined;

  constructor(private route: ActivatedRoute ,private routeing : Router, private examService: ExamService , private QuestionService : QuestionService) { }

  ngOnInit(): void {
    this.exam_Id = this.route.snapshot.params['examId'];
    console.log(this.exam_Id);
    this.loadQuestions();
  }

  deleteQuestion(DeleteQueId:number): void {
    if (!DeleteQueId) {
      console.error('Question ID not found.');
      return;
    }
  
    const confirmDelete = window.confirm('Are you sure you want to delete this question?');
    if (!confirmDelete) {
      return; 
    }
  
    this.QuestionService.deleteQuestion(DeleteQueId).subscribe(
      () => {
        alert('Exam deleted successfully.');
        this.loadQuestions();
      },
      error => {
        console.error('Failed to delete question:', error);
      }
    );
  }
  

  loadQuestions() {
    this.QuestionService.getQuestionbyExamId(this.exam_Id).subscribe(
      questions => {
        this.questions = questions;
      },
      error => {
        console.error('Error fetching questions:', error);
      }
    );
  }
}
