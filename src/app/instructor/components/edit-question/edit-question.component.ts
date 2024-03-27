import { Component, OnInit, OnDestroy } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { IExam } from 'src/app/instructor/interface/i-exam';
import { ExamService } from '../../service/exam.service';
import { QuestionService } from '../../service/question.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IQuestion } from '../../interface/iquestion';

@Component({
  selector: 'app-edit-question',
  templateUrl: './edit-question.component.html',
  styleUrls: ['./edit-question.component.scss']
})
export class EditQuestionComponent implements OnInit, OnDestroy {
  constructor(private QuestionService: QuestionService,  private formBuilder: FormBuilder,
     private myRoute: Router, private act: ActivatedRoute) 
  
  {
    this.questionForm = this.formBuilder.group({
      question: ['', [Validators.required]],
      correctAnswer: ['', [Validators.required]],
      questionType: ['', [Validators.required, Validators.minLength(3)]],
      exam_ID: [''],
      choosesName: this.formBuilder.array([this.createChoiceFormControl()])
    });
  }

  get questionFormControl(): { [key: string]: AbstractControl } {
    return this.questionForm.controls;
  }
  createChoiceFormControl(): FormControl {
    return this.formBuilder.control('');
  }

  get choicesFormArray(): FormArray {
    return this.questionForm.get('choosesName') as FormArray;
  }

  addChoice(): void {
    this.choicesFormArray.push(this.createChoiceFormControl());
  }

  removeChoice(index: number): void {
    if (this.choicesFormArray.length > 1) {
      this.choicesFormArray.removeAt(index);
    } else {
      alert('At least one choice is required.');
    }
  }


  myGetSub: Subscription | undefined;
  myActionSub: Subscription | undefined;
  questionForm: FormGroup;
  question: IQuestion | undefined;
  id: number = 0;
  
  ngOnDestroy(): void {
    this.myGetSub?.unsubscribe();
    this.myActionSub?.unsubscribe();
  }
  ngOnInit(): void {
    this.id = this.act.snapshot.params['questionId'];

    this.myGetSub = this.QuestionService.getQuestionById(this.id).subscribe(
      (data: IQuestion) => {
        this.question = data;
        this.questionForm.patchValue({
          question: data.question,
          correctAnswer: data.correctAnswer,
          questionType: data.questionType,
          
        });
        if (data.choosesName) {
          this.questionForm.setControl('choosesName', this.formBuilder.array(data.choosesName.map(choice => this.formBuilder.control(choice))));
        }
      },
      error => {
        console.error('Failed to fetch question:', error);
      }
    );

    }

    onSubmit(event: Event) {
      if (!this.id) {
        console.error('Question ID not found.');
        return;
      }
  
      if (this.questionForm.valid) {
        const formData = this.questionForm.value;
       
        
        this.myActionSub = this.QuestionService.updateQuestion(this.id ,formData)
          .subscribe(
            () => {
              alert('Question updated successfully.');
              this.myRoute.navigate(['examDetails', this.id]); 
            },
            error => {
              console.error('Failed to update question:', error);
            }
          );
      } else {
        console.error('Invalid question form.');
      }
    }
  }




