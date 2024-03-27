import { ExamService } from 'src/app/instructor/service/exam.service';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { QuestionService } from 'src/app/instructor/service/question.service';
import { IQuestion } from 'src/app/instructor/interface/iquestion';
import { IExam } from 'src/app/instructor/interface/i-exam';

@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.scss']
})
export class AddQuestionComponent implements OnInit, OnDestroy {
  exam: IExam | undefined;
  questionForm: FormGroup;
  examId: number | null = null; // Changed to nullable
  myGetSub: Subscription | undefined;
  myActionSub: Subscription | undefined;

  constructor(
    private examService: ExamService,
    private questionService: QuestionService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.questionForm = this.formBuilder.group({
      question: ['', [Validators.required]],
      correctAnswer: ['', [Validators.required]],
      questionType: ['', [Validators.required, Validators.minLength(3)]],
      exam_ID: [''],
      choosesName: this.formBuilder.array([this.createChoiceFormControl()])
    }, { validators: this.validateChoices });
  }



  validateChoices(control: AbstractControl): { [key: string]: any } | null {
    const correctAnswer = control.get('correctAnswer')?.value;
    const choosesName = control.get('choosesName') as FormArray;

    if (choosesName.controls.map(control => control.value).indexOf(correctAnswer) == -1) {
      return { 'invalidCorrectAnswer': true };
    }
    return null;
  }

  createChoiceFormControl(defaultValue: string = ''): FormControl {
    return this.formBuilder.control(defaultValue);
  }

  get choicesFormArray(): FormArray {
    return this.questionForm.get('choosesName') as FormArray;
  }

  addChoice(defaultValue: string = ''): void {
    this.choicesFormArray.push(this.createChoiceFormControl(defaultValue));
  }
  

  removeChoice(index: number): void {
    if (this.choicesFormArray.length > 1) {
      this.choicesFormArray.removeAt(index);
    } else {
      alert('At least one choice is required.');
    }
  }

  ngOnInit(): void {

    this.examId = +this.route.snapshot.params['examId'] ; 
    this.questionForm.controls['exam_ID'].setValue(this.examId);
    
    this.myGetSub = this.examService.getExamById(this.examId).subscribe(
      (exam: IExam) => {
        this.exam = exam;
      },
      error => {
        console.error('Failed to fetch exam:', error);
      }
    );
  }

  ngOnDestroy(): void {
    this.myGetSub?.unsubscribe();
    this.myActionSub?.unsubscribe();
  }

  resetForm(): void {
    this.questionForm.reset();
    this.choicesFormArray.clear();
    this.addChoice(); // Add one choice by default
  }

  onSubmit(): void {
    if (this.examId === null) { 
      console.error('Exam ID not found.'); 
      return;
    }

    console.log(this.questionForm.value)
    if (this.questionForm.valid) {
      const questionData = this.questionForm.value;

      
    questionData.choosesName = questionData.choosesName.map((choice: any) => choice.choosesName);
      this.myActionSub = this.questionService.addQuestion(questionData, this.examId)
        .subscribe(
          () => {
            alert('Question added successfully, Here is the form to add another one');
            this.resetForm();
          },
          error => {
            console.error('Failed to add question:', error);
          }
        );
    } else {

      alert('Please Fill The Form Correctly');
    }
  }
  
  get questionFormControl(): { [key: string]: AbstractControl } {
    return this.questionForm.controls;
  }
}
