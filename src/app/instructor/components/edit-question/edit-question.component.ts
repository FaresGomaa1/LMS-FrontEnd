import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { QuestionService } from 'src/app/instructor/service/question.service';

@Component({
  selector: 'app-edit-question',
  templateUrl: './edit-question.component.html',
  styleUrls: ['./edit-question.component.scss']
})
export class EditQuestionComponent implements OnInit, OnDestroy {
  QuestionForm!: FormGroup;
  questionData: any;
  questionId!:number;
  examid!:number;
  numOfQuestions: { value: number, label: string }[] = [
    { value: 2, label: '2 choices' },
    { value: 3, label: '3 choices' },
    { value: 4, label: '4 choices' },
    { value: 5, label: '5 choices' }

  ];
  constructor(
    private quesServices: QuestionService,
    private router: Router,
    private actRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.QuestionForm = this.fb.group({
      question: ['', [Validators.required, Validators.minLength(3)]],
      selectNumber: ['', Validators.required],
      choosesName: this.fb.array([]),
      questionType: ['', Validators.required],
      correctAnswer: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.actRoute.params.subscribe(params => {
      const questionId = params['questionId'];
      this.questionId= questionId;
      this.quesServices.getQuestionById(questionId).subscribe(
        (data) => {
          this.questionData = data;
          this.examid= data.exam_ID
          this.initializeForm();
        },
        (error) => {
          console.error('Error fetching question data: ', error);
        }
      );
    });
  }

  initializeForm(): void {
    if (this.questionData) {
      this.QuestionForm.patchValue({
        question: this.questionData.question,
        selectNumber: this.questionData.choosesName.length,
        correctAnswer: this.questionData.correctAnswer,
        questionType: this.questionData.questionType
      });

      const choicesArray = this.QuestionForm.get('choosesName') as FormArray;
      choicesArray.clear();

      this.questionData.choosesName.forEach((choice: string) => {
        const control = this.fb.control(choice, Validators.required);
        choicesArray.push(control);
      });
    }

    this.QuestionForm.get('selectNumber')?.valueChanges.subscribe(
      (value: number) => {
          this.buildQuestionTypeControls(value);
      }
  );
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


buildQuestionTypeControls(num: number): void {
  const controls = [];
  for (let i = 0; i < num; i++) {
      controls.push(this.fb.control('', Validators.required));
  }
  this.QuestionForm.setControl('choosesName', this.fb.array(controls));
}

getArrayFromNumber(num: number): number[] {
    return Array.from({ length: num }, (_, index) => index);
}
  onSubmit(e:Event): void {
    if (this.QuestionForm.valid) {
      const formData = this.QuestionForm.value;
      this.questionData.question = formData.question;
      this.questionData.selectNumber = formData.selectNumber;
      this.questionData.correctAnswer = formData.correctAnswer;
      this.questionData.questionType = formData.questionType;
      this.questionData.choosesName = formData.choosesName;
      this.quesServices.updateQuestion(this.questionId,this.questionData).subscribe(
        (updatedQuestion) => {
          this.router.navigate(['instructor/shared/viewQuestions',this.examid  ]);
        },
        (error) => {
          console.error('Error updating question: ', error);
 
        }
      );
    } else {
      
    }
  }

  ngOnDestroy(): void {
  }
}
