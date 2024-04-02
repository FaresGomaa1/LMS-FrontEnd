// import { Component, OnDestroy, OnInit } from '@angular/core';
// import { FormControl, FormGroup, Validators } from '@angular/forms';
// import { ActivatedRoute, Router } from '@angular/router';
// import { Subscription } from 'rxjs';
// import { ExamService } from 'src/app/instructor/service/exam.service';
// import { IExam } from 'src/app/instructor/interface/i-exam';

// @Component({
//   selector: 'app-edit-exam',
//   templateUrl: './edit-exam.component.html',
//   styleUrls: ['./edit-exam.component.scss']
// })
// export class EditExamComponent implements OnInit , OnDestroy{

//   Exam: IExam | undefined;
//   id: number = 0;

//   formSubmitted = false;
  
//   ExamForm: FormGroup = new FormGroup({
//     numberOfQuestions: new FormControl( '',[Validators.required , Validators.min(1) ]),
//     name: new FormControl('',[Validators.required ,Validators.minLength(3)]),
//     duration: new FormControl('', [Validators.required, Validators.min(1)]),
//     date: new FormControl('', [Validators.required, this.startDateValidator.bind(this)]),
//     time: new FormControl('', [Validators.required]),
//     max_Degree: new FormControl('', [Validators.required]),
//     min_Degree: new FormControl('', [Validators.required]),
//     course_ID: new FormControl(''),
//   });

//   startDateValidator(control: any) {
//     const selectedDate = new Date(control.value);
//     const currentDate = new Date();
//     if (selectedDate <= currentDate) {
//       return { startDateInvalid: true };
//     }
//     return null;
//   }


//   formatTime(time: string): string {
//     const [hours, minutes] = time.split(':');
//     const formattedTime = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:00`;
//     return formattedTime;
//   }

//   constructor(private ExamService: ExamService, private myRoute: Router, private act: ActivatedRoute) {
   
//   }
  
//   ngOnDestroy(): void {
//     this.myGetSub?.unsubscribe();
//     this.myActionSub?.unsubscribe();
//   }

//   myGetSub: Subscription | undefined;
//   myActionSub: Subscription | undefined;



//   get numberquestionControl() {
//     return this.ExamForm.controls['numberOfQuestions'];
//   }
//   get nameControl() {
//     return this.ExamForm.controls['name'];
//   }
 
//   get durationControl() {
//     return this.ExamForm.controls['duration'];
//   }
//   get maxControl() {
//     return this.ExamForm.controls['max_Degree'];
//   }
//   get minControl() {
//     return this.ExamForm.controls['min_Degree'];
//   }
//   get dateControl() {
//     return this.ExamForm.controls['date'];
//   }
//   get timeControl() {
//     return this.ExamForm.controls['time'];
//   }

//   ngOnInit(): void {

//   this.id = this.act.snapshot.params['examId'];
 
//     this.myGetSub =  this.ExamService.getExamById(this.id).subscribe((data) => {

//       this.ExamForm.controls['name'].setValue(data.name);
//       this.ExamForm.controls['date'].setValue(data.date);
//       this.ExamForm.controls['time'].setValue(data.time);
//       this.ExamForm.controls['numberOfQuestions'].setValue(data.numberOfQuestions);
//       this.ExamForm.controls['min_Degree'].setValue(data.min_Degree);
//       this.ExamForm.controls['max_Degree'].setValue(data.max_Degree);
//       this.ExamForm.controls['duration'].setValue(data.duration);
//       this.ExamForm.controls['course_ID'].setValue(data.course_ID);
//   });
//   }


  

//   onSubmit(event: Event) {
//     event.preventDefault();
  
//     const timeValue = this.ExamForm.get('time')?.value;
//     const formattedTime = timeValue ? this.formatTime(timeValue) : '';
  
//     this.ExamForm.get('time')?.setValue(formattedTime);
  
//     if (this.ExamForm.valid) {
//       const examData: IExam = {
//         numberOfQuestions: this.ExamForm.get('numberOfQuestions')?.value,
//         name: this.ExamForm.get('name')?.value,
//         duration: this.ExamForm.get('duration')?.value,
//         date: this.ExamForm.get('date')?.value,
//         time: formattedTime,   
  
//         max_Degree: this.ExamForm.get('max_Degree')?.value,
//         min_Degree: this.ExamForm.get('min_Degree')?.value,
//         course_ID: this.ExamForm.get('course_ID')?.value,
//         id: this.id
//       };
  
//       this.ExamService.updateExam(this.id, examData).subscribe(
//         () => {
//           console.log('Exam Edited successfully.');
//           this.myRoute.navigate(['/instructor/shared/CoursesExam', this.ExamForm.get('course_ID')?.value]);
//         },
//         error => {
//           console.error('Failed to Edit exam:', error);
//         }
//       );
//     }
//   }
  
// }



