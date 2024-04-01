import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { IQuestion } from './iquestion';
import { QuestionService } from './question.service';
import { ExamService } from '../../exam.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { IExam } from '../../iexam';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent implements OnInit {
  tokenKey = 'auth_token';
  id: number = 0;
  allQuestions: IQuestion[] = [];
  questionForm: FormGroup;
  correctedAnswers: string[] = [];
  result: number = 0;
  exam!:IExam;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
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
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event: any) {
    event.returnValue = 'Are you sure you want to leave? Your progress will be lost.';
  }

  getIdFromUrl(): void {
    this.route.params.subscribe(params => {
      this.id = +params['id'];
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
        this.allQuestions = questions.filter(question => question.exam_ID === this.id);
        this.initializeForm();
      },
      (error) => {
        console.error('Error fetching questions:', error);
      }
    );
  }

  initializeForm(): void {
    const answersArray = this.questionForm.get('answers') as FormArray;
    this.allQuestions.forEach((question, index) => {
      const control = this.formBuilder.control('', Validators.required);
      answersArray.push(control);
    });
  }
  

  getStudentId(): number {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      const helper = new JwtHelperService();
      const decodedToken = helper.decodeToken(token);
      return decodedToken.nameid; 
    }
    return 0;
  }

  submitForm(): void {
    if (this.questionForm.valid) {
      this.correctedAnswers = [];
      this.result = 0;
  
      this.questionService.getAllQuestions().subscribe((questions) => {
        questions.forEach(question => {
          if (question.exam_ID === this.id){
            this.correctedAnswers.push(question.correctAnswer);
          }
        });
  
        const userAnswers = this.questionForm.value.answers;
        console.log(userAnswers);
  
        this.examService.getExamById(this.id).subscribe((exam) => {
          const questionDegree = exam.max_Degree / this.correctedAnswers.length;
          for (let i = 0; i < this.correctedAnswers.length; i++) {
            if (this.correctedAnswers[i] === userAnswers[i]) {
              this.result = this.result + questionDegree;
            }
          }
  
          localStorage.setItem(`result${this.getStudentId()}:${this.id}`, this.result.toString());
          localStorage.setItem(`exam${this.id}`, this.id?.toString());
          this.router.navigate(['shared/exam']);
        });
      });
    } else {
      alert("You missed some questions");
    }
  }
  
}