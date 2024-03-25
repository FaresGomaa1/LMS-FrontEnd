
import { Component, OnDestroy, OnInit } from '@angular/core';
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

  questionForm: FormGroup = new FormGroup({
    question: new FormControl( '',[Validators.required , Validators.minLength(20) ,this.questionWithChoicesValidator ]),
    correctAnswer: new FormControl('',[Validators.required , Validators.pattern(/^[1234abcd]$/i) , Validators.maxLength(1)]),
    questionType: new FormControl('', [Validators.required, Validators.minLength(11),Validators.maxLength(11)]),
   
  });

  questionWithChoicesValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const questionWithChoices = control.value;
      
      if (!questionWithChoices || !(/[1234abcd]/i.test(questionWithChoices))) {
        return { 'invalidQuestionWithChoices': true }; 
      }
  
      return null; 
    };
  }
  

  exam_ID: number | null = null; // Initialize exam_ID as null initially

  constructor(private QuestionService: QuestionService, private myRoute: Router, private act: ActivatedRoute) {
    const examIdParam = this.act.snapshot.paramMap.get('exam_Id');
    if (examIdParam !== null) {
      this.exam_ID = +examIdParam!; // Convert to number if not null, with non-null assertion operator
    } else {
      // Handle the case where exam_ID is null
      console.error('Exam ID is null.');
    }
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

