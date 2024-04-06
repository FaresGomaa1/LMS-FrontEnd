import { QuestionService } from 'src/app/instructor/service/question.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ExamService } from 'src/app/instructor/service/exam.service';
import { IExam } from 'src/app/instructor/interface/i-exam';
import { IQuestion } from 'src/app/instructor/interface/iquestion';
import { QuestionInExamService } from 'src/app/instructor/service/question-in-exam.service';

@Component({
  selector: 'app-edit-exam',
  templateUrl: './edit-exam.component.html',
  styleUrls: ['./edit-exam.component.scss']
})
export class EditExamComponent implements OnInit, OnDestroy {
  ExamForm: FormGroup;
  id: number = 0;
  selectTime: any;
  private myActionSub: Subscription | undefined;
  allQuestions: any[] = [];
  constructor(
    private examService: ExamService,
    private router: Router,
    private actRoute: ActivatedRoute,
    private questionService : QuestionService,
    private questionInExamService: QuestionInExamService
  ) {
    this.ExamForm = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      duration: new FormControl('', Validators.required),
      time: new FormControl('', Validators.required),
      max_Degree: new FormControl('', Validators.required),
      min_Degree: new FormControl('', Validators.required),
   //   courseName: new FormControl('', Validators.required),
      date: new FormControl('', [
        Validators.required,
        this.endValidator(new Date()),
      ]),
    }, { validators: this.degreeRangeValidator });
  }

  ngOnInit(): void {
    


    this.actRoute.params.subscribe((params) => {
      this.id = params['examId'];
      this.examService.getExamById(this.id).subscribe((exam: IExam) => {
     
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
  }

  formatTime(time: string): string {
    const [hours, minutes] = time.split(':');
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:00`;
  }

  degreeRangeValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const minDegree = control.get('min_Degree')?.value;
    const maxDegree = control.get('max_Degree')?.value;

    if (minDegree !== null && maxDegree !== null && minDegree > maxDegree) {
      return { minGreaterThanMax: true };
    }
    return null;
  };

  getFormControl(name: string): FormControl {
    return this.ExamForm.get(name) as FormControl;
}
  endValidator(currentDate: Date): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const selectedDate: Date = new Date(control.value);
      if (selectedDate < currentDate) {
        return { past: true };
      }
      return null;
    };
  }

  getTime(event: any): void {
    this.selectTime = event.target.value;
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    console.log(1);
 
    const formattedTime = this.formatTime(this.ExamForm.get('time')?.value);
    this.ExamForm.get('time')?.setValue(formattedTime);
    console.log(this.ExamForm.value);
    console.log(this.allQuestions);
 

if (this.ExamForm.valid) {
  const examData = this.ExamForm.value;
  const examPayload = {
    ...examData
  };

  this.examService.updateExam(this.id, examPayload).subscribe(() => {
    this.router.navigate(['/instructor/shared/viewQuestions', this.id]);
  }, (error) => {
    console.error('Error updating exam:', error);
  });

    } else {
      
    }
  }

  ngOnDestroy(): void {
     
    this.myActionSub?.unsubscribe();
  }
}
