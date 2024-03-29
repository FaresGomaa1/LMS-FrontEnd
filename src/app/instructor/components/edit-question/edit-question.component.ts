import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { QuestionService } from 'src/app/instructor/service/question.service';
import { IQuestion } from 'src/app/instructor/interface/iquestion';
import { IExam } from 'src/app/instructor/interface/i-exam';
import { ExamService } from 'src/app/instructor/service/exam.service';

@Component({
  selector: 'app-edit-question',
  templateUrl: './edit-question.component.html',
  styleUrls: ['./edit-question.component.scss']
})
export class EditQuestionComponent implements OnInit, OnDestroy {
  questionForm!: FormGroup;
  questionId: number | null = null; 
  question: IQuestion | undefined;
  examId: number | null = null; 
  numberOfQuestions: number | undefined;
  questionCount: number = 0;
  myGetSub: Subscription | undefined;
  myActionSub: Subscription | undefined;

  constructor(private formBuilder: FormBuilder, 
              private questionService: QuestionService,
              private examService: ExamService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.questionId = +this.route.snapshot.params['questionId'];
    if (this.questionId) {
        this.myGetSub = this.questionService.getQuestionById(this.questionId).subscribe(
            (question: IQuestion) => {
                this.question = question;
                console.log('Question Details:', question);
                this.initializeForm();
            },
            error => {
                console.error('Failed to fetch question:', error);
            }
        );
    }
  }

  ngOnDestroy(): void {
    this.myGetSub?.unsubscribe();
    this.myActionSub?.unsubscribe();
  }

  initializeForm(): void {
    const choicesArray = this.formBuilder.array([
      this.formBuilder.control(this.question?.choosesName[0], Validators.required),
      this.formBuilder.control(this.question?.choosesName[1], Validators.required),
      this.formBuilder.control(this.question?.choosesName[2]),
      this.formBuilder.control(this.question?.choosesName[3])
    ]);
  
    this.questionForm = this.formBuilder.group({
      question: [this.question?.question, Validators.required],
      choices: choicesArray,
      correctAnswer: [this.question?.correctAnswer, [Validators.required, this.correctAnswerValidator(choicesArray)]],
      questionType: [this.question?.questionType, Validators.required],
      exam_ID: [this.question?.exam_ID, Validators.required]
    });
  
    console.log(this.numberOfQuestions);
  }

  getChoiceControl(index: number): FormControl {
    return (this.questionForm.get('choices') as FormArray).controls[index] as FormControl;
  }

  isChoiceInvalid(): boolean {
    const choicesArray = this.questionForm.get('choices') as FormArray;
    return choicesArray.controls.slice(0, 2).some(control => control.invalid && control.touched);
  }

  correctAnswerValidator(choicesArray: FormArray): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const correctAnswer = control.value;
      if (!correctAnswer || choicesArray.value.indexOf(correctAnswer) === -1) {
        return { incorrectAnswer: true };
      }
      return null;
    };
  }

  onSubmit(e:Event): void {
    
    if (!this.questionId) { 
      console.error('Question ID not found.'); 
      return;
    }
  

    if (this.questionForm.valid) {
      console.log('11111.'); 
      const choicesArray = this.questionForm.get('choices') as FormArray;
      const choices: string[] = [];
      
      choicesArray.controls.forEach(control => {
        const choiceValue = control.value?.trim();  
        if (choiceValue && choiceValue !== '') {     
          choices.push(choiceValue);
        }
      });
    
      const questionData: IQuestion = {
        id: this.questionId, 
        question: this.questionForm.value.question,
        exam_ID: this.questionForm.value.exam_ID,
        choosesName: choices,
        correctAnswer: this.questionForm.value.correctAnswer,
        questionType: this.questionForm.value.questionType
      };
      
      this.myActionSub = this.questionService.updateQuestion(this.questionId, questionData).subscribe(
        () => {
          alert('Question updated successfully.');
          this.router.navigate(['examDetails', this.examId]); 
        },
        error => {
          console.error('Failed to update question:', error);
        }
      );
    } else {
      this.questionForm.markAllAsTouched();
    }
  }
}
