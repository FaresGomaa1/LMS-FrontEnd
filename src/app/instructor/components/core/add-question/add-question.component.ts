
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { QuestionService } from 'src/app/instructor/service/question.service';

@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.scss']
})
export class AddQuestionComponent implements OnInit , OnDestroy {
  @Input() exam_ID: number | null = null;
  
  questionForm: FormGroup = new FormGroup({
    question: new FormControl( '',[Validators.required , Validators.minLength(20) ]),
    correctAnswer: new FormControl('',[Validators.required , Validators.pattern(/^[1234abcd]$/i) , Validators.maxLength(1)]),
    questionType: new FormControl('', [Validators.required, Validators.minLength(3)]),
    chooseOne: new FormControl('', [Validators.required, Validators.minLength(3)]),
    chooseTwo: new FormControl('', [Validators.required, Validators.minLength(3)]),
    chooseThree: new FormControl('', [ Validators.minLength(3)]),
    chooseFour: new FormControl('', [ Validators.minLength(3)]),

  });

 

  constructor(private QuestionService: QuestionService, private myRoute: Router, private act: ActivatedRoute) {
   
  }
  
  ngOnDestroy(): void {
    this.myGetSub?.unsubscribe();
    this.myActionSub?.unsubscribe();
  }

  myGetSub: Subscription | undefined;
  myActionSub: Subscription | undefined;

  ngOnInit(): void {

  }

  get questionControl() {
    return this.questionForm.controls['question'];
  }
  get correctAnswerControl() {
    return this.questionForm.controls['correctAnswer'];
  }
  get typeControl() {
    return this.questionForm.controls['questionType'];
  }
  get oneControl() {
    return this.questionForm.controls['chooseOne'];
  }

  get TwoControl() {
    return this.questionForm.controls['chooseTwo'];
  }
  get ThreeControl() {
    return this.questionForm.controls['chooseThree'];
  }
  get FourControl() {
    return this.questionForm.controls['chooseFour'];
  }

  onSubmit(e: Event) {
    e.preventDefault();
    if (this.exam_ID === null) {
      this.myRoute.navigate(['instructorCourses']);
      return; 
    }
  
    this.myActionSub = this.QuestionService.addQuestion(this.questionForm.value, this.exam_ID)
      .subscribe(
        () => {
          console.log('Question added successfully.');
          this.myRoute.navigate(['addExam']);
        },
        error => {
          console.error('Failed to add question:', error);
        }
      );
  }
  
  

}

