import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ExamService } from "src/app/instructor/service/exam.service";
import { IExam } from "src/app/instructor/interface/i-exam";
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from "@angular/forms";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-add-exam',
  templateUrl: './add-exam.component.html'
})
export class AddExamComponent implements OnInit , OnDestroy {
  Exam: IExam | undefined;
  course_Id: number = 0;
 
  formSubmitted = false;

  ExamForm: FormGroup;

  constructor(private ExamService: ExamService, private myRoute: Router, private act: ActivatedRoute) {
    this.ExamForm = new FormGroup({
      numberOfQuestions: new FormControl('', [Validators.required, Validators.min(1)]),
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      duration: new FormControl('', [Validators.required, Validators.min(1)]),
      time: new FormControl('', [Validators.required]),
      date: new FormControl('', [Validators.required, this.startDateValidator.bind(this)]),
      max_Degree: new FormControl('', [Validators.required]),
      min_Degree: new FormControl('', [Validators.required]),
      course_ID: new FormControl(''),
    }, { validators: this.maxGreaterThanMinValidator });
  }

  formatTime(time: string): string {
    const [hours, minutes] = time.split(':');
    const formattedTime = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:00`;
    return formattedTime;
  }

  ngOnDestroy(): void {
    this.myGetSub?.unsubscribe();
    this.myActionSub?.unsubscribe();
  }

  myGetSub: Subscription | undefined;
  myActionSub: Subscription | undefined;

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

  ngOnInit(): void {
    this.course_Id = this.act.snapshot.params['courseId'];
    this.ExamForm.controls['course_ID'].setValue(this.course_Id);
    console.log(this.course_Id);
  }

  onSubmit(event: Event) {
    event.preventDefault();
    console.log(this.ExamForm.value);
    
    const formattedTime = this.formatTime(this.ExamForm.get('time')?.value);
    this.ExamForm.get('time')?.setValue(formattedTime);
    console.log(this.ExamForm.value);
    if (!this.course_Id) {
      this.myRoute.navigate(['instructorCourses']);
    console.log(2);

      return;
    }

    if (this.ExamForm.valid && !this.formSubmitted) { 
    console.log(3);

      this.ExamService.addExam(this.ExamForm.value).subscribe(
        (response: any) => { 
          console.log('Exam added successfully.');
          const examId = response.examId;
          console.log(examId);
          const numberOfQuestions = this.ExamForm.get('numberOfQuestions')?.value;
          this.myRoute.navigate(['instructor/shared/CoursesExam', this.course_Id]);
        },
        error => {
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

  maxGreaterThanMinValidator: ValidatorFn = (control: AbstractControl): {[key: string]: any} | null => {
    const maxDegree = control.get('max_Degree');
    const minDegree = control.get('min_Degree');

    return maxDegree && minDegree && maxDegree.value <= minDegree.value ? { maxLessThanMin: true } : null;
  };
}
