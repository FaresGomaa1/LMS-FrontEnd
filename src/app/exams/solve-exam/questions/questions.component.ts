import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { IQuestion } from './iquestion';
import { QuestionService } from './question.service';
import { ExamService } from '../../exam.service';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent implements OnInit {
  id: number | undefined;
  allQuestions: IQuestion[] = [];
  questionForm: FormGroup;
  duration!: number;

  constructor(
    private route: ActivatedRoute,
    private questionService: QuestionService,
    private examService: ExamService,
    private formBuilder: FormBuilder
  ) {
    this.questionForm = this.formBuilder.group({
      answers: this.formBuilder.array([])
    });
  }

  ngOnInit(): void {
    this.getIdFromUrl();
    this.autoSubmitAfterDuration();
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event: any) {
    event.returnValue = 'Are you sure you want to leave? Your progress will be lost.';
  }

  getIdFromUrl(): void {
    this.route.params.subscribe(params => {
      this.id = +params['id'];
      this.examService.getExamById(this.id).subscribe((exam) => {
        this.duration = +exam.duration;
      })
      if (!isNaN(this.id)) {
        this.filterQuestions();
      } else {
        console.error('Invalid exam ID');
      }
    });
  }

  filterQuestions(): void {
    this.questionService.getAllQuestions().subscribe(
      (questions) => {
        console.log(questions)
        this.allQuestions = questions.filter(question => question.exam_ID === this.id);
        this.initializeForm();
      }
    );
  }

  initializeForm(): void {
    const answersArray = this.questionForm.get('answers') as FormArray;
    this.allQuestions.forEach(question => {
      answersArray.push(this.formBuilder.control(''));
    });
  }

  submitForm(): void {
    if (this.questionForm.valid) {
      console.log(this.questionForm.value);
    }
  }

  autoSubmitAfterDuration(): void {
    setTimeout(() => {
      this.submitForm();
    }, this.duration * 60 * 1000);
  }
}