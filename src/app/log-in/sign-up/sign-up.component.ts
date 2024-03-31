import { InstructorService } from '../../generalServices/instructor.service';
import { StudentService } from './../../generalServices/student.service';
import { ICourse } from 'src/app/instructor/interface/i-course';
import { Component,  OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import {IStudent1} from "../../Interfaces/student-for-add"


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss', '../log-in.component.scss'],
})
export class SignUpComponent implements OnInit {
  checkConfirmedPassword: boolean = true;
  studentForm!: FormGroup;
  selectedFile!: File;
  imagePreview: string | ArrayBuffer | null = null;
  check:number = 1;
  checkEmailIsUnique:boolean = true;
  private myActionSub: Subscription | undefined;

  coursesNames: ICourse[] = [];
  allEmails: string[] = [];


  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private router: Router,
    private InstructorService :InstructorService,
  ) {
 
  }
  createForm() {
    this.studentForm = this.fb.group({
      id: [0, Validators.required],
      name: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern('^[a-zA-Z]+( [a-zA-Z]+)+$'),
      ]],
      age: ['', [Validators.required, Validators.min(18)]],
      title: ['', [
        Validators.required,
        Validators.minLength(4),
      ]],
      phone: ['', [
        Validators.required,
        Validators.minLength(11),
        Validators.maxLength(11),
        Validators.pattern('^01[0152]+[0-9]{8,}$'),
      ]],
      address: ['', [
        Validators.required,
        Validators.minLength(5),
      ]],
      ssn: ['', [
        Validators.required,
        Validators.pattern(/^\d{14}$/),
      ]],
      email: ['', [
        Validators.required,
        Validators.email,
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)
      ]],
      userAttachmentPath: [''],
      imageFile: [null, Validators.required]
    });
  }
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.studentForm.patchValue({
        imageFile: file,
      });
    }
  }
  comparePassword() {
    let passwordValue = (document.getElementById("password") as HTMLInputElement).value;
    let confirmPasswordValue = (document.getElementById("confirmPassword") as HTMLInputElement).value;

    if (passwordValue === confirmPasswordValue) {
      this.checkConfirmedPassword = true;
    } else {
      this.checkConfirmedPassword = false;
    }
  }
ngOnInit(): void {
  this.createForm();
  this.isEmailUnique();
}
  openCourseDetails(courseId: number): void {
    window.open(`http://localhost:4200/coursedetails/${courseId}`, '_blank');
  }

  onSubmit() {
    const studentFormData = new FormData();
    Object.keys(this.studentForm.value).forEach(key => {
      studentFormData.append(key, this.studentForm.get(key)?.value);
    });
    this.studentService.Add(studentFormData).subscribe(
      response => {
        window.location.href = '/login';
        console.log('Registration successful', response);
      },
      error => {
        // Handle error
        console.error('Edit failed', error);
        if (error && error.error && error.error.errors) {
          // If there are validation errors, handle them here
          const validationErrors = error.error.errors;
          // Example: Display validation errors in console
          console.log('Validation errors:', validationErrors);
        } else {
          // Handle other types of errors
          console.error('Unknown error:', error);
        }
      }
    );
  
  }
  
  

  
  isEmailUnique() {
    this.allEmails = []; 
    this.studentService.getAllStudents().subscribe((stds) => {
      for (let i = 0; i < stds.length; i++) {
        this.allEmails.push(stds[i].email.toLowerCase()); 
      }
    });
    this.InstructorService.getAllInstructors().subscribe((ins) => {
      for (let i = 0; i < ins.length; i++) {
        this.allEmails.push(ins[i].email.toLowerCase()); 
      }
    });
  }
}
