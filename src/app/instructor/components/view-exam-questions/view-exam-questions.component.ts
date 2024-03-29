
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
  questions! : IQuestion[]  ;

  constructor(private route: ActivatedRoute, private examService: ExamService , private QuestionService : QuestionService) { }

  ngOnInit(): void {
    this.exam_Id = this.route.snapshot.params['examId'];
    console.log(this.exam_Id);
    this.loadQuestions();
  }
 
  getMaxChoices(): number[] {
    let maxChoices = 0;
    for (const question of this.questions) {
      if (question.choosesName.length > maxChoices) {
        maxChoices = question.choosesName.length;
      }
    }
    return Array(maxChoices).fill(0).map((x, i) => i + 1);
  }

  deleteQuestion(id: number) {
    if (confirm('Are you sure you want to delete this question?')) {
      this.QuestionService.deleteQuestion(id)
        .subscribe(() => {
          console.log(`Question with ID ${id} deleted successfully.`);
          // Refresh the list of questions after deletion
          this.loadQuestions();
        }, error => {
          console.error('Error deleting question:', error);
        });
    }}
  

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
