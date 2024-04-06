import { ExamService } from 'src/app/instructor/service/exam.service';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionService } from 'src/app/instructor/service/question.service';
import { IExam } from 'src/app/instructor/interface/i-exam';

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

      this.ExamForm = new FormGroup({
        name: new FormControl('', [
          Validators.required,
          Validators.minLength(3),
        ]),
        duration: new FormControl('', Validators.required),
        time: new FormControl('', Validators.required),
        max_Degree: new FormControl('', Validators.required),
        min_Degree: new FormControl('', Validators.required),
        course_ID: new FormControl('', Validators.required),
     //   courseName: new FormControl('', Validators.required),
        date: new FormControl('', [
          Validators.required 
        ]),
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
  ExamForm!: FormGroup;
examId!:number;
allQuestions: any[] = [];
  ngOnInit(): void {
   
    this.actRoute.params.subscribe((params) => {
      this.examId = params['examId'];
      this.ExamService.getExamById(this.examId).subscribe((exam: IExam) => {
     
        this.ExamForm.patchValue({
          name: exam.name,
          duration: exam.duration,
          time: exam.time,
          max_Degree: exam.max_Degree,
          min_Degree: exam.min_Degree,
          courseName: exam.courseName,
          date: exam.date,
          course_ID : exam.course_ID
        });
        this.allQuestions= exam.allQuestion;
      });
    });

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
  
    if (this.QuestionForm.valid) {
      const questionData = this.QuestionForm.value;
  
      // Construct the new question object
      const newQuestion = {
        question: questionData.question,
        questionType: questionData.questionType,
        correctAnswer: questionData.correctAnswer,
        choosesName: questionData.choosesName
      };
  
      // Get the exam data from the form
      const examData = this.ExamForm.value;
  
      // Update exam with new question
      this.ExamService.updateExamWithQuestions(this.examId, examData, newQuestion).subscribe(() => {
        this.router.navigate(['/instructor/shared/viewQuestions', this.examId]);
      }, (error) => {
        console.error('Error updating exam:', error);
      });
    }
  }
  
      ngOnDestroy(): void {};
  }



