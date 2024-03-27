
import { QuestionService } from 'src/app/instructor/service/question.service';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

  constructor(private route: ActivatedRoute, private examService: ExamService , private QuestionService : QuestionService) { }

  ngOnInit(): void {
    this.exam_Id = this.route.snapshot.params['examId'];
    console.log(this.exam_Id);
    this.loadQuestions();
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
