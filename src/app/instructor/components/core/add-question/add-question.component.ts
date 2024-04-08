import { FormBuilder, FormArray, Validators, AbstractControl, ValidatorFn, FormGroup, FormControl, ValidationErrors } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';
import { QuestionService } from 'src/app/instructor/service/question.service';
import { ExamService } from 'src/app/instructor/service/exam.service';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionInExamService } from 'src/app/instructor/service/question-in-exam.service';
import { Component, OnInit } from '@angular/core';
import { PopupQuestionComponent } from '../popup-question/popup-question.component';

@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.scss']
})
export class AddQuestionComponent implements OnInit {
  QuestionForm: FormGroup; 
  numOfQuestions: { value: number, label: string }[] = [
    { value: 2, label: '2 choices' },
    { value: 3, label: '3 choices' },
    { value: 4, label: '4 choices' },
    { value: 5, label: '5 choices' }

  ];
  
  allDataQuestion: any[] = [];
  // location: any;
  // dialog: MatDialog;
  constructor(
      private quesServices: QuestionService,
      private router: Router,
      private actRoute: ActivatedRoute, 
      private fb: FormBuilder,
      private questionInExamService: QuestionInExamService,
      private dialog: MatDialog,
      private location: Location
  ) {
      this.QuestionForm = this.fb.group({
          question: ['', [Validators.required, Validators.minLength(3)]],
          selectNumber: ['', Validators.required],
          choosesName: this.fb.array([]),
          questionType: ['', Validators.required],
          correctAnswer: ['', [Validators.required,this.correctAnswerValidator ]]
          // courseName: ['', Validators.required],
      });
   
  }

  
 correctAnswerValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const correctAnswer = control.value;
    const choices = control.parent?.get('choosesName')?.value;
    
    if (correctAnswer && choices && !choices.includes(correctAnswer)) {
      return { incorrectAnswer: true };
    }
  
    return null;
  };

  ngOnInit(): void {
   

      

      this.QuestionForm.get('selectNumber')?.valueChanges.subscribe(
          (value: number) => {
              this.buildQuestionTypeControls(value);
          }
      );
  }

  buildQuestionTypeControls(num: number): void {
      const controls = [];
      for (let i = 0; i < num; i++) {
          controls.push(this.fb.control('', Validators.required));
      }
      this.QuestionForm.setControl('choosesName', this.fb.array(controls));
  }

  getFormControl(name: string): FormControl {
      return this.QuestionForm.get(name) as FormControl;
  }
  get choosesName() {
      return this.QuestionForm.get('choosesName') as FormArray;
  }

  getChooseControl(index: number): FormControl {
    return this.choosesName.at(index) as FormControl;
  }
  

  getArrayFromNumber(num: number): number[] {
      return Array.from({ length: num }, (_, index) => index);
  }

  openPopup() {
      const dialogRef = this.dialog.open(PopupQuestionComponent, {
          width: '400px',
          height: '230px',
      });

      dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            console.log(this.allDataQuestion + " returned from popup")
              this.questionInExamService.setSelectedQuestions(
                  this.allDataQuestion
              );
             
          } else {
              this.questionInExamService.setSelectedQuestions(
                this.allDataQuestion
            );
            console.log(JSON.stringify(this.questionInExamService.getSelectedQuestions()), "returned from");
              this.location.back();
          }
      });
  }

 

  onSubmit(e: Event) {
      e.preventDefault();
console.log(this.QuestionForm.value);

      if (this.QuestionForm.valid) {
          const questionData = this.QuestionForm.value;
          // const courseId = questionData.courseName.id;

          const questions = {
              ...questionData,
             
          };

          console.log(questions);
          this.allDataQuestion.push(questions);
          console.log(this.allDataQuestion);

         
          this.QuestionForm.reset();

          this.openPopup(); 
      } else {
        this.markFormGroupTouched(this.QuestionForm);
      }
  }
  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
        if (control instanceof FormGroup) {
            this.markFormGroupTouched(control);
        } else {
            control.markAsTouched();
        }
    });
}
  ngOnDestroy(): void {}

}