import { FormBuilder, FormArray, Validators, AbstractControl, ValidatorFn, FormGroup, FormControl } from '@angular/forms';
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
  questionForm!: FormGroup;
  allDataQuestion: any[] = [];
  numberOfQuestions: number | undefined;
  exam: any; // Define the type of exam

  constructor(private formBuilder: FormBuilder,
              private questionService: QuestionService,
              private examService: ExamService,
              private router: Router,
              private route: ActivatedRoute,
              private questionInExamService: QuestionInExamService,
              private dialog: MatDialog,
              private location: Location) { }

  ngOnInit(): void {
    this.initializeForm();
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
  

  openPopup(): void {
    const dialogRef = this.dialog.open(PopupQuestionComponent, {
      width: '400px',
      height: '230px',
    });
console.log(this.allDataQuestion)
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.questionInExamService.setSelectedQuestions(this.allDataQuestion);
      } else {
        this.location.back();
      }
    });
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
      questionType: ['', Validators.required]
    });

    this.numberOfQuestions = this.exam?.numberOfQuestions;
  }

 

  onSubmit(event: Event): void {
    event.preventDefault();
    if (this.questionForm.valid) {
      const choicesArray = this.questionForm.get('choices') as FormArray;
      const choices: string[] = [];
      choicesArray.controls.forEach(control => {
        const choiceValue = control.value.trim();
        if (choiceValue !== '') {
          choices.push(choiceValue);
        }
      });

      const questionData = this.questionForm.value;
      const questions = {
        question: questionData.question,
        choosesName: choices,
        correctAnswer: questionData.correctAnswer,
        questionType: questionData.questionType
      };

      console.log(questions)
      this.allDataQuestion.push(questions);
      this.questionForm.reset();
      this.openPopup();
    }
  }
}




