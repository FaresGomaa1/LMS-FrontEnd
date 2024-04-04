import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamService } from 'src/app/instructor/service/exam.service';
import { IExam } from 'src/app/instructor/interface/i-exam';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { ICourse } from 'src/app/instructor/interface/i-course';

@Component({
  selector: 'app-add-exam',
  templateUrl: './add-exam.component.html',
})
export class AddExamComponent implements OnInit, OnDestroy {
  Exam: IExam | undefined;
  course_Id: number = 0;
  course!: ICourse;
  formSubmitted = false;
  ExamForm!: FormGroup;
  start: Date = new Date();
  constructor(
    private examService: ExamService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {
      this.ExamForm = this.formBuilder.group(
        {
          name: ['', [Validators.required, Validators.minLength(3)]],
          duration: ['', [Validators.required, Validators.min(1)]],
          time: ['', [Validators.required]],
          date: ['', [Validators.required, this.endValidator(this.start)]],
          max_Degree: ['', [Validators.required]],
          min_Degree: ['', [Validators.required]],
          course_ID: [''],
          courseName: ['dotnet'],
          questions: this.formBuilder.array([]),
        },
        { validators: this.degreeRangeValidator }
      );
  }

  endValidator(day: Date): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const selectedDate: Date = new Date(control.value);
      if (selectedDate < day) {
        return { past: true };
      }
      return null;
    };
  }

  get questions(): FormArray | null {
    const questionsControl = this.ExamForm.get('questions');
    return questionsControl instanceof FormArray ? questionsControl : null;
  }

  getChoiceControl(index: number): FormControl {
    return (this.questions?.at(index)?.get('choices') as FormArray).controls[
      index
    ] as FormControl;
  }

  isChoiceInvalid(): boolean {
    const choicesArray = this.ExamForm.get('questions') as FormArray;
    return choicesArray.controls
      .slice(0, 2)
      .some((control) => control.invalid && control.touched);
  }

  addQuestion(): void {
    const questionsArray = this.questions;
    if (questionsArray) {
      const choicesArray = this.formBuilder.array([
        this.createChoice(),
        this.createChoice(),
        this.formBuilder.control(''),
        this.formBuilder.control(''),
      ]);

      const questionGroup = this.formBuilder.group({
        question: ['', Validators.required],
        questionType: ['MCQ', Validators.required],
        correctAnswer: [
          '',
          [Validators.required, this.correctAnswerValidator(choicesArray)],
        ],
        choices: choicesArray,
      });

      questionsArray.push(questionGroup);
      console.log('Question added');
    } else {
      console.error("Form array 'questions' is null.");
    }
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

  removeQuestion(index: number): void {
    const questionsArray = this.questions;
    if (questionsArray) {
      questionsArray.removeAt(index);
    } else {
      console.error("Form array 'questions' is null.");
    }
  }

  createChoice(): FormGroup {
    return this.formBuilder.group({
      choice: ['', Validators.required],
    });
  }

  degreeRangeValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const minDegree = control.get('min_Degree')?.value;
    const maxDegree = control.get('max_Degree')?.value;

    if (minDegree !== null && maxDegree !== null && minDegree > maxDegree) {
      control.get('min_Degree')?.setErrors({ minGreaterThanMax: true });
      return { minGreaterThanMax: true };
    } else {
      if (control.get('min_Degree')?.hasError('minGreaterThanMax')) {
        control.get('min_Degree')?.setErrors(null);
      }
      return null;
    }
  };

  get numberquestionControl() {
    return this.ExamForm.controls['numberOfQuestions'];
  }
  get nameControl() {
    return this.ExamForm.controls['name'];
  }

  get durationControl() {
    return this.ExamForm.controls['duration'];
  }
  get maxControl() {
    return this.ExamForm.controls['max_Degree'];
  }
  get minControl() {
    return this.ExamForm.controls['min_Degree'];
  }
  get dateControl() {
    return this.ExamForm.controls['date'];
  }

  get timeControl() {
    return this.ExamForm.controls['time'];
  }

  formatTime(time: string): string {
    const [hours, minutes] = time.split(':');
    const formattedTime = `${hours.padStart(2, '0')}:${minutes.padStart(
      2,
      '0'
    )}:00`;
    return formattedTime;
  }

  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.course_Id = this.route.snapshot.params['courseId'];

    this.ExamForm.controls['course_ID'].setValue(this.course_Id);
    console.log(this.course_Id);
  }

  onSubmit(event: Event) {
    event.preventDefault();
    console.log(' clicked');
    console.log(this.ExamForm.value);

    const formattedTime = this.formatTime(this.ExamForm.get('time')?.value);
    this.ExamForm.get('time')?.setValue(formattedTime);

    if (!this.course_Id) {
      this.router.navigate(['instructorCourses']);
      return;
    }

    if (this.ExamForm.valid) {
      console.log(this.ExamForm.value);
      this.examService.addExam(this.ExamForm.value).subscribe(
        (examId: any) => {
          console.log('Exam added successfully.');
          this.router.navigate(['instructor/shared/addQuestions']);
          console.log(examId);
        },
        (error) => {
          console.error('Failed to add exam:', error);
        }
      );
    }
  }

  startDateValidator(control: any) {
    const selectedDate = new Date(control.value);
    const currentDate = new Date();
    if (selectedDate <= currentDate) {
      return { startDateInvalid: true };
    }
    return null;
  }

  maxGreaterThanMinValidator: ValidatorFn = (
    control: AbstractControl
  ): { [key: string]: any } | null => {
    const maxDegree = control.get('max_Degree');
    const minDegree = control.get('min_Degree');

    return maxDegree && minDegree && maxDegree.value <= minDegree.value
      ? { maxLessThanMin: true }
      : null;
  };
}
