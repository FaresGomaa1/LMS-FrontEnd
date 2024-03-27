
import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ExamService } from "src/app/instructor/service/exam.service";
import { IExam } from "src/app/instructor/interface/i-exam";
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-add-exam',
  templateUrl: './add-exam.component.html'
})
export class AddExamComponent implements OnInit , OnDestroy{

  today :Date = new Date();
  Exam: IExam | undefined;
  course_Id: number = 0;

  formSubmitted = false;

  ExamForm: FormGroup = new FormGroup({
    numberOfQuestions: new FormControl('0'),
    name: new FormControl('',[Validators.required ,Validators.minLength(3)]),
    duration: new FormControl('', [Validators.required]),
    time: new FormControl('', [Validators.required]),
    date: new FormControl('', [Validators.required , this.minDateValidator.bind(this, this.today)]),
    max_Degree: new FormControl('', [Validators.required]),
    min_Degree: new FormControl('', [Validators.required]),
    course_ID: new FormControl(''),


  });

  // Custom validator function for min/max degree
  minMaxDegreeValidator(group: FormGroup): { [key: string]: boolean } | null {
    const maxDegree = group.get('max_Degree')?.value;
    const minDegree = group.get('min_Degree')?.value;
    if (maxDegree !== '' && minDegree !== '' && maxDegree <= minDegree) {
      return { 'invalidMinMaxDegree': true };
    }
    return null;
  }

  minDateValidator(day: Date): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const selectedDate: Date = new Date(control.value);
      if (selectedDate < day) {
        return { 'minDate': true };
      }
      return null;
    };
  }
 

  constructor(private ExamService: ExamService, private myRoute: Router, private act: ActivatedRoute  ) {
   
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

  numberOfQuestions: number = 0;
  tabs: string[] = [];
  selectedTab: number = 0;
  examId: number = 1; 
  

  onSubmit(event: Event) {
    event.preventDefault();
    if (!this.course_Id) {
      this.myRoute.navigate(['instructorCourses']);
      return;
    }
    if (this.ExamForm.valid && !this.formSubmitted) { 
      console.log(this.ExamForm.value);
      this.ExamService.addExam(this.ExamForm.value).subscribe(
        () => {
          console.log('Exam added successfully.');

        },
        error => {
          console.error('Failed to add exam:', error);
 
        },
        
      );
    }
  
  
  }
}
