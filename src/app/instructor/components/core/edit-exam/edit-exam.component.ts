import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ExamService } from 'src/app/instructor/service/exam.service';
import { IExam } from 'src/app/instructor/interface/i-exam';

@Component({
  selector: 'app-edit-exam',
  templateUrl: './edit-exam.component.html',
  styleUrls: ['./edit-exam.component.scss']
})
export class EditExamComponent implements OnInit , OnDestroy{

  Exam: IExam | undefined;
  id: number = 0;
  today :Date = new Date();

  formSubmitted = false;
  
  ExamForm: FormGroup = new FormGroup({
    numberOfQuestions: new FormControl( '',[Validators.required , Validators.min(1) ]),
    name: new FormControl('',[Validators.required ,Validators.minLength(3)]),
    duration: new FormControl('', [Validators.required]),
    date: new FormControl('', [Validators.required , this.minDateValidator.bind(this, this.today)]),
  //  time: new FormControl('', [Validators.required]),
    max_Degree: new FormControl('', [Validators.required]),
    min_Degree: new FormControl('', [Validators.required]),
    course_ID: new FormControl(''),
  });

 
  minDateValidator(day: Date): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const selectedDate: Date = new Date(control.value);
      if (selectedDate < day) {
        return { 'minDate': true };
      }
      return null;
    };
  }
  constructor(private ExamService: ExamService, private myRoute: Router, private act: ActivatedRoute) {}
  
  ngOnDestroy(): void {
    this.myGetSub?.unsubscribe();
    this.myActionSub?.unsubscribe();
  }

  myGetSub: Subscription | undefined;
  myActionSub: Subscription | undefined;
 
  get timeControl() {
    return this.ExamForm.controls['time'];
  }
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

  ngOnInit(): void {

  this.id = this.act.snapshot.params['examId'];
 
    this.myGetSub =  this.ExamService.getExamById(this.id).subscribe((data) => {

      this.ExamForm.controls['name'].setValue(data.name);
      this.ExamForm.controls['date'].setValue(data.date);
      this.ExamForm.controls['min_Degree'].setValue(data.min_Degree);
      this.ExamForm.controls['max_Degree'].setValue(data.max_Degree);
      this.ExamForm.controls['duration'].setValue(data.duration);
      this.ExamForm.controls['course_ID'].setValue(data.course_ID);
     // this.ExamForm.controls['time'].setValue(data.time);

  });
  }

  numberOfQuestions: number = 0;
  tabs: string[] = [];
  selectedTab: number = 0;
  examIdQuestion: number = 1; 


  


  onSubmit(event: Event) {
    event.preventDefault();
   
    if (this.ExamForm.valid  && !this.formSubmitted) { 
      console.log(this.ExamForm);
      const examData: IExam = {
        numberOfQuestions: this.ExamForm.get('numberOfQuestions')?.value,
        name: this.ExamForm.get('name')?.value,
        duration: this.ExamForm.get('duration')?.value,
        date: this.ExamForm.get('date')?.value,
        max_Degree: this.ExamForm.get('max_Degree')?.value,
        min_Degree: this.ExamForm.get('min_Degree')?.value,
        course_ID: this.ExamForm.get('course_ID')?.value,
     //   time: this.ExamForm.get('time')?.value,
        id:this.id
      };
      this.ExamService.updateExam( this.id, examData ).subscribe(
        () => {
          console.log('Exam Edited successfully.');
          alert('Now you can Edit ' + this.ExamForm.get('numberOfQuestions')?.value + ' Questions');

        },
        error => {
          console.error('Failed to Edit exam:', error);
 
        },
        
      );
    }
  
  
  }
}
