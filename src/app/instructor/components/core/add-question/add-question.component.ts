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
export class AddQuestionComponent implements OnInit {
  questionForm!: FormGroup;
  examId: number | null = null; 

  constructor(private formBuilder: FormBuilder, private questionService: QuestionService,
    private examService: ExamService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  

  ngOnInit(): void {
    this.initializeForm();
    this.examId = +this.route.snapshot.params['examId'];
    this.questionForm.get('exam_ID')?.setValue(this.examId); 
  }
  getChoiceControl(index: number): FormControl {
    return (this.questionForm.get('choices') as FormArray).controls[index] as FormControl;
  }

  
  isChoiceInvalid(): boolean {
    const choicesArray = this.questionForm.get('choices') as FormArray;
    return choicesArray.controls.slice(0, 2).some(control => control.invalid && control.touched);
  }
  initializeForm(): void {
    const choicesArray = this.formBuilder.array([
      this.formBuilder.control('', Validators.required),
      this.formBuilder.control('', Validators.required),
      this.formBuilder.control(''),
      this.formBuilder.control('')
    ]);
  
    this.questionForm = this.formBuilder.group({
      question: ['', Validators.required],
      choices: choicesArray,
      correctAnswer: ['', [Validators.required, this.correctAnswerValidator(choicesArray)]],
      questionType: ['', Validators.required],
      exam_ID: [null, Validators.required] 
    }); 
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

  onSubmit(): void {
    if (this.examId === null) { 
      console.error('Exam ID not found.'); 
      return;
    }
  console.log(this.questionForm.value)
    if (this.questionForm.valid) {
      const choicesArray = this.questionForm.get('choices') as FormArray;
      const choices: string[] = [];
      
      choicesArray.controls.forEach(control => {
        const choiceValue = control.value.trim(); 
        if (choiceValue !== '') {
          choices.push(choiceValue);
        }
      });
  
      const questionData: IQuestion = {
        id: 0, 
        question: this.questionForm.value.question,
        exam_ID: this.questionForm.value.exam_ID,
        choosesName: choices,
        correctAnswer: this.questionForm.value.correctAnswer,
        questionType: this.questionForm.value.questionType
      };
  
      this.questionService.addQuestion(questionData, this.examId).subscribe(
        (response) => {
          console.log('Question added successfully:', response);
          this.router.navigate(['/instructor/shared/viewQuestions', this.examId]);
        },
        (error) => {
          console.error('Error adding question:', error);
        }
      );
    } else {
      this.questionForm.markAllAsTouched();
    }
  }
  
}
