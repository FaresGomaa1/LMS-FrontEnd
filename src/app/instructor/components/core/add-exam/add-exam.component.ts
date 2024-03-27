
import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ExamService } from "src/app/instructor/service/exam.service";
import { IExam } from "src/app/instructor/interface/i-exam";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-add-exam',
  templateUrl: './add-exam.component.html'
})
export class AddExamComponent implements OnInit , OnDestroy{

  Exam: IExam | undefined;
  course_Id: number = 0;

  formSubmitted = false;

  ExamForm: FormGroup = new FormGroup({
    numberOfQuestions: new FormControl( '',[Validators.required , Validators.min(1) ]),
    name: new FormControl('',[Validators.required ,Validators.minLength(3)]),
    duration: new FormControl('', [Validators.required]),
    date: new FormControl('', [Validators.required]),
    max_Degree: new FormControl('', [Validators.required]),
    min_Degree: new FormControl('', [Validators.required]),
    course_ID: new FormControl(''),


  });

 

  constructor(private ExamService: ExamService, private myRoute: Router, private act: ActivatedRoute) {
   
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

  ngOnInit(): void {

  
  this.course_Id = this.act.snapshot.params['courseId'];
  this.ExamForm.controls['course_ID'].setValue(this.course_Id);
    console.log(this.course_Id);

 
  }

  numberOfQuestions: number = 0;
  tabs: string[] = [];
  selectedTab: number = 0;
  examId: number = 1; 
  generateTabs() {
    this.tabs = Array.from({ length: this.numberOfQuestions }, (_, i) => `Question ${i + 1}`);
    this.selectedTab = 0; 
  }

  openTab(index: number) {
    this.selectedTab = index;
  }

  onSubmit(event: Event) {
    event.preventDefault();
    if (!this.course_Id) {
      this.myRoute.navigate(['instructorCourses']);
      return;
    }
    if (this.ExamForm.valid && !this.formSubmitted) { 
      this.formSubmitted = true; 
      this.ExamService.addExam(this.ExamForm.value).subscribe(
        () => {
          console.log('Exam added successfully.');
          this.myRoute.navigate(['/instructor/shared/CoursesExam' ,this.course_Id]);
        },
        error => {
          console.error('Failed to add exam:', error);
 
        },
        
      );
    }
  
  
  }
}
