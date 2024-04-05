import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ExamService } from "src/app/instructor/service/exam.service";
import { IExam } from "src/app/instructor/interface/i-exam";
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { ICourse } from "src/app/instructor/interface/i-course";
import { IQuestion } from "src/app/instructor/interface/iquestion";
import { QuestionService } from "src/app/instructor/service/question.service";
import { CourseService } from "src/app/instructor/service/course.service";
import { QuestionInExamService } from "src/app/instructor/service/question-in-exam.service";

@Component({
  selector: 'app-add-exam',
  templateUrl: './add-exam.component.html'
})
export class AddExamComponent implements OnInit, OnDestroy {

course: ICourse | undefined;
  minNumber!: number;
    ExamForm: FormGroup;
    start: Date = new Date();
    questionNames: string[] = [];
    allCourse: ICourse[] = [];

    courseID!: number;
    SelectedCourse!: number;

    private myActionSub: Subscription | undefined;
    dialog: any;
    selectTime: any;
    selectedQuestions: IQuestion[]=[];
    constructor(
        private examService: ExamService,
        private router: Router,
        private actRoute: ActivatedRoute,
        private quesServices: QuestionService,
        private courseServies: CourseService,
        private questionInExamService: QuestionInExamService
    ) {
        this.ExamForm = new FormGroup(
            {
                name: new FormControl('', [
                    Validators.required,
                    Validators.minLength(3),
                ]),
                duration: new FormControl('', Validators.required),
                time: new FormControl('', Validators.required),
                max_Degree: new FormControl('', Validators.required),
                min_Degree: new FormControl('', Validators.required),
                courseName: new FormControl('', Validators.required),
                //allQuestion: new FormControl('', Validators.required),
                date: new FormControl('', [
                    Validators.required,
                    this.endValidator(this.start),
                ]),
            },
            { validators: this.degreeRangeValidator }
        );
    }

    formatTime(time: string): string {
        const [hours, minutes] = time.split(':');
        const formattedTime = `${hours.padStart(2, '0')}:${minutes.padStart(
            2,
            '0'
        )}:00`;
        return formattedTime;
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

    endValidator(day: Date): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const selectedDate: Date = new Date(control.value);
            if (selectedDate < day) {
                return { past: true };
            }
            return null;
        };
    }


    getCourseById(courseId: number | undefined): void {
        if (courseId) {
            this.courseServies.getCourseById(courseId).subscribe(
                (course: ICourse) => {
                    this.course = course;
                    console.log('Fetched course:', course); 
                    this.ExamForm.controls['courseName'].setValue(course.name);
                    console.log(this.course?.name);
      
                },
                error => {
                    console.error('Failed to fetch course:', error);
                }
            );
        }
    }

    getFormControl(name: string): FormControl {
        return this.ExamForm.get(name) as FormControl;
    }
    enableInputs: boolean = false;
    id: number = 0;

    checkSelectedQuestions(): void {
        this.selectedQuestions = this.questionInExamService.getSelectedQuestions();
        console.log('DataOfQuestions after adding:', this.selectedQuestions);
        if (this.selectedQuestions.length > 0) {
          this.enableInputs = true; // Enable inputs if selectedQuestions has data
        }
      }
    ngOnInit(): void {
    console.log('hello')
     
         
    this.checkSelectedQuestions();
        this.selectedQuestions = this.questionInExamService.getSelectedQuestions();
        console.log('DataOfQuestions after adding:', this.selectedQuestions);
        console.log('hello 22')
        this.courseID = this.actRoute.snapshot.params['courseId'];
         console.log(this.courseID);
         this.getCourseById(this.courseID);
        this.ExamForm.controls['course_ID'].setValue(this.courseID);
     
        

     

    }


    getTime(e: any) {
        this.selectTime = e.target.value;
        console.log(this.selectTime);
    }

    onSubmit(e: Event) {
        e.preventDefault();
        console.log(1);
        
        const formattedTime = this.formatTime(this.ExamForm.get('time')?.value);
        this.ExamForm.get('time')?.setValue(formattedTime);

        const examData = this.ExamForm.value;

        console.log(examData);

   
        const selectedQuestions =
            this.questionInExamService.getSelectedQuestions();
            console.log(this.selectedQuestions + 'selected')

        const allDataQuestions = selectedQuestions.map((question) => ({
            question: question.question,
            questionType: question.questionType,
            correctAnswer: question.correctAnswer,
            choosesName: [...question.choosesName],
        }));

        console.log(allDataQuestions+ 'get all')
        const exams = {
            ...examData,
            course_ID: this.courseID,
            allQuestion: allDataQuestions,
        };

        console.log('exam allQuestion', exams.allQuestion);

        console.log(exams);

        if (this.ExamForm.valid) {
         
                this.examService.addExam(exams).subscribe(() => {});
      
            this.router.navigate(['/instructor/shared/courseDetails/', this.courseID]);
        }
    }

    ngOnDestroy(): void {
        this.myActionSub?.unsubscribe();
    }










//   Exam: IExam | undefined;
//   course_Id: number = 0;
//  course!:ICourse;
//   formSubmitted = false;
//   ExamForm!: FormGroup;
//   start: Date = new Date();
//   constructor(private examService: ExamService, private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder) {
//     this.ExamForm = this.formBuilder.group({
//       name: ['', [Validators.required, Validators.minLength(3)]],
//       duration: ['', [Validators.required, Validators.min(1)]],
//       time: ['', [Validators.required]],
//       date: ['', [Validators.required ,this.endValidator(this.start)]],
//       max_Degree: ['', [Validators.required]],
//       min_Degree: ['', [Validators.required]],
//       course_ID: [''],
//       courseName: ['dotnet'],
//       questions: this.formBuilder.array([])
//     }, { validators: this.degreeRangeValidator });
//   }

//   endValidator(day: Date): ValidatorFn {
//     return (control: AbstractControl): ValidationErrors | null => {
//         const selectedDate: Date = new Date(control.value);
//         if (selectedDate < day) {
//             return { past: true };
//         }
//         return null;
//     };
// }

//   get questions(): FormArray | null {
//     const questionsControl = this.ExamForm.get('questions');
//     return questionsControl instanceof FormArray ? questionsControl : null;
//   }

//   getChoiceControl(questionIndex: number, choiceIndex: number): FormControl {
//     const questionGroup = this.questions?.at(questionIndex) as FormGroup;
//     const choicesArray = questionGroup.get('choices') as FormArray;
//     return choicesArray.controls[choiceIndex] as FormControl;
// }


//   isChoiceInvalid(): boolean {
//     const choicesArray = this.ExamForm.get('questions') as FormArray;
//     return choicesArray.controls.slice(0, 2).some(control => control.invalid && control.touched);
//   }

//   addQuestion(): void {
//     const questionsArray = this.questions;
//     if (questionsArray) {
//       const choicesArray = this.formBuilder.array([
//         this.createChoice(),
//         this.createChoice(),
//         this.formBuilder.control(''),
//         this.formBuilder.control('')
//       ]);
      
//       const questionGroup = this.formBuilder.group({
//         question: ['', Validators.required],
//         questionType: ['MCQ', Validators.required],
//         correctAnswer: ['', [Validators.required , this.correctAnswerValidator(choicesArray)]],
//         choosesName: choicesArray
//       });


   
  
//       questionsArray.push(questionGroup);
//       console.log('Question added');
//     } else {
//       console.error("Form array 'questions' is null.");
//     }
//   }

//   correctAnswerValidator(choicesArray: FormArray): ValidatorFn {
//     return (control: AbstractControl): { [key: string]: any } | null => {
//       const correctAnswer = control.value;
//       if (!correctAnswer || choicesArray.value.indexOf(correctAnswer) === -1) {
//         return { incorrectAnswer: true };
//       }
//       return null;
//     };
//   }

  
//   removeQuestion(index: number): void {
//     const questionsArray = this.questions;
//     if (questionsArray) {
//       questionsArray.removeAt(index);
//     } else {
//       console.error("Form array 'questions' is null.");
//     }
//   }
 
//   createChoice(): FormGroup {
//     return this.formBuilder.group({
//       choice: ['', Validators.required]
//     });
//   }

//   degreeRangeValidator: ValidatorFn = (
//     control: AbstractControl
//   ): ValidationErrors | null => {
//     const minDegree = control.get('min_Degree')?.value;
//     const maxDegree = control.get('max_Degree')?.value;

//     if (minDegree !== null && maxDegree !== null && minDegree > maxDegree) {
//         control.get('min_Degree')?.setErrors({ minGreaterThanMax: true });
//         return { minGreaterThanMax: true };
//     } else {
//         if (control.get('min_Degree')?.hasError('minGreaterThanMax')) {
//             control.get('min_Degree')?.setErrors(null);
//         }
//         return null;
//     }
//   };

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

//   formatTime(time: string): string {
//     const [hours, minutes] = time.split(':');
//     const formattedTime = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:00`;
//     return formattedTime;
//   }

//   ngOnDestroy(): void {
    
//   }

//   ngOnInit(): void { 
//     this.course_Id = this.route.snapshot.params['courseId'];
    
//     this.ExamForm.controls['course_ID'].setValue(this.course_Id);
//     console.log(this.course_Id);

    
//   }

//   onSubmit(event: Event ) {
//     event.preventDefault();
//     console.log(' clicked')
//   console.log(this.ExamForm.value);
  
//     const formattedTime = this.formatTime(this.ExamForm.get('time')?.value);
//     this.ExamForm.get('time')?.setValue(formattedTime);
  
//     if (!this.course_Id) {
//       this.router.navigate(['instructorCourses']);
//       return;
//     }
  
//     if (this.ExamForm.valid ) {
//         console.log(this.ExamForm.value)
//       this.examService.addExam(this.ExamForm.value).subscribe(
//         (examId: any) => {
//           console.log('Exam added successfully.');
//           this.router.navigate(['instructor/shared/addQuestions']);
//           console.log(examId);  
//         },
//         error => {
//           console.error('Failed to add exam:', error);
//         }
//       );
//     }
//   }

//   startDateValidator(control: any) {
//     const selectedDate = new Date(control.value);
//     const currentDate = new Date();
//     if (selectedDate <= currentDate) {
//       return { startDateInvalid: true };
//     }
//     return null;
//   }

//   maxGreaterThanMinValidator: ValidatorFn = (control: AbstractControl): {[key: string]: any} | null => {
//     const maxDegree = control.get('max_Degree');
//     const minDegree = control.get('min_Degree');

//     return maxDegree && minDegree && maxDegree.value <= minDegree.value ? { maxLessThanMin: true } : null;
//   };  
}
