import { ExamService } from 'src/app/instructor/service/exam.service';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionService } from 'src/app/instructor/service/question.service';

@Component({
  selector: 'app-add-new-ques',
  templateUrl: './add-new-ques.component.html',
  styleUrls: ['./add-new-ques.component.scss']
})
export class AddNewQuesComponent implements OnInit {
  QuestionForm: FormGroup; 
  numOfQuestions: { value: number, label: string }[] = [
    { value: 2, label: '2 choices' },
    { value: 3, label: '3 choices' },
    { value: 4, label: '4 choices' },
    { value: 5, label: '5 choices' }

  ];
  
  allDataQuestion: any[] = [];
 
  constructor(
      private quesServices: QuestionService,
      private router: Router,
      private actRoute: ActivatedRoute, 
      private fb: FormBuilder,
      private ExamService : ExamService
  ) {
      this.QuestionForm = this.fb.group({
          question: ['', [Validators.required, Validators.minLength(3)]],
          selectNumber: ['', Validators.required],
          choosesName: this.fb.array([]),
          questionType: ['', Validators.required],
          correctAnswer: ['', [Validators.required]]
          // courseName: ['', Validators.required],
      });
  }

  correctAnswerValidator(choicesArray: FormArray): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const correctAnswer = control.value;
      const isCorrectAnswerValid = choicesArray.value.includes(correctAnswer);
      if (!correctAnswer || !isCorrectAnswerValid) {
        return { incorrectAnswer: true };
      }
      return null;
    };
  }
  
examId!:number;
  ngOnInit(): void {
   

    this.examId = this.actRoute.snapshot.params['examId'];
      

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


 

  onSubmit(e: Event) {
      e.preventDefault();
      console.log(this.QuestionForm.value);

      if (this.QuestionForm.valid) {
          const questionData = this.QuestionForm.value;
          // const courseId = questionData.courseName.id;

          const questions = {
              ...questionData
          };

          console.log(questions);
    
         
      } else {
      }
  }

  ngOnDestroy(): void {}

}