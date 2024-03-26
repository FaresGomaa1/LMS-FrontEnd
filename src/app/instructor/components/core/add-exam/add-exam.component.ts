
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
 
 
  ExamForm: FormGroup = new FormGroup({
    numberOfQuestions: new FormControl( '',[Validators.required , Validators.min(1) ]),
    name: new FormControl('',[Validators.required ,Validators.maxLength(3)]),
    duration: new FormControl('', [Validators.required]),
    date: new FormControl('', [Validators.required]),
    max_Degree: new FormControl('', [Validators.required]),
    min_Degree: new FormControl('', [Validators.required]),
   
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
    this.act.params.subscribe(params => {
      const course_Id = params['course_ID']; 
      console.log('Course ID:', course_Id);
  })
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

  onSubmit(e: Event) {
    e.preventDefault();
    const course_Id = this.act.snapshot.params['course_ID'];
    if (!course_Id) {
      this.myRoute.navigate(['instructorCourses']);
      return;
    }
  
    this.myActionSub = this.ExamService.addExam(this.ExamForm.value, course_Id)
      .subscribe(
        () => {
          console.log('Exam added successfully.');
          this.myRoute.navigate(['instructorCourses']);
        },
        error => {
          console.error('Failed to add exam:', error);
        }
      );
  }
  
  
  }
  
