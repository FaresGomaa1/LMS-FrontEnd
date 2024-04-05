import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ICourse } from 'src/app/instructor/interface/i-course';
import { IExam } from 'src/app/instructor/interface/i-exam';
import { IInstructor } from 'src/app/instructor/interface/i-instructor';
import { ExamService } from 'src/app/instructor/service/exam.service';

@Component({
  selector: 'app-all-exams',
  templateUrl: './all-exams.component.html',
  styleUrls: ['./all-exams.component.scss']
})
export class AllExamsComponent implements OnInit {

  exams: IExam[] | undefined;
  tokenKey = 'auth_token';
  userId: number = 0;
  ExamForm!: FormGroup;
  constructor(private route: ActivatedRoute, private examService: ExamService ,   private formBuilder: FormBuilder) {
   
  }

  public instructor: IInstructor | undefined;
  ngOnInit(): void {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      const helper = new JwtHelperService();
      const decodedToken = helper.decodeToken(token);
      this.userId = decodedToken.nameid;
    }     

    
      this.ExamForm = this.formBuilder.group({
        name: ['', [Validators.required, Validators.minLength(3)]],
        duration: ['', [Validators.required, Validators.min(1)]],
        time: ['', [Validators.required]],
        date: ['', [Validators.required ]],
        max_Degree: ['', [Validators.required]],
        min_Degree: ['', [Validators.required]],
        course_ID: [1],
        courseName: ['dotnet'],
        questions: this.formBuilder.array([])
      });
   
  }

  createQuestion(): FormGroup {
    return this.formBuilder.group({
      question: ['', Validators.required],
      questionType: ['', Validators.required], // Add form control for question type
      correctAnswer: ['', Validators.required], // Add form control for correct answer
      choosesName: this.formBuilder.array([this.formBuilder.control('')]), // Add form array for multiple choices
      // Add more form controls for other question properties as needed
    });
  }
   
  formatTime(time: string): string {
    const [hours, minutes] = time.split(':');
    const formattedTime = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:00`;
    return formattedTime;
  }

  get questionsArray(): FormArray {
    return this.ExamForm.get('questions') as FormArray;
  }

  addQuestion(): void {
    this.questionsArray.push(this.createQuestion());
  }

  removeQuestion(index: number): void {
    (this.ExamForm.get('questions') as FormArray).removeAt(index);
  }

  submitExam(): void {
    const formattedTime = this.formatTime(this.ExamForm.get('time')?.value);
    this.ExamForm.get('time')?.setValue(formattedTime);
  
    if (this.ExamForm.valid) {
      const examData: IExam = this.ExamForm.value;
      this.examService.addExam(examData).subscribe(
        (response) => {
          // Handle success
          console.log('Exam added successfully:', response);
        },
        (error) => {
          // Handle error
          console.error('Failed to add exam:', error);
        }
      );
    }
  }
 
   
  
  }

 
