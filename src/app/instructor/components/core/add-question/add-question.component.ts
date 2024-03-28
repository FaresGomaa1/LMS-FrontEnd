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
  correctAnswerValidator(): ValidatorFn {
    return (formGroup: AbstractControl): { [key: string]: any } | null => {
      const choices = formGroup.get('choices')?.value.split(',');
      const correctAnswer = formGroup.get('correctAnswer')?.value;
      
      if (choices && correctAnswer) {
        if (choices.indexOf(correctAnswer) == -1) {
          return { 'incorrectAnswer': true };
        }
      }
      return null;
    };
  }
  
  initializeForm(): void {
    this.questionForm = this.formBuilder.group({
      question: ['', Validators.required],
      choices: ['', Validators.required],
      correctAnswer: ['', Validators.required],
      questionType: ['', Validators.required],
      exam_ID: [null, Validators.required] 
    }, { validator: this.correctAnswerValidator() }); 
  }

  onSubmit(): void {

    if (this.examId === null) { 
          console.error('Exam ID not found.'); 
          return;
        }
    if (this.questionForm.valid) {
      const questionData: IQuestion = {
        id: 0, 
        question: this.questionForm.value.question,
        exam_ID: this.questionForm.value.exam_ID,
        choosesName: this.questionForm.value.choices.split(','),
        correctAnswer: this.questionForm.value.correctAnswer,
        questionType: this.questionForm.value.questionType
      };

      this.questionService.addQuestion(questionData , this.examId).subscribe(
        (response) => {
          console.log('Question added successfully:', response);
          
          this.router.navigate(['/instructor/shared/viewQuestions' ,this.examId]);
      
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
