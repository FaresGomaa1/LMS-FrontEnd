import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InstructorService } from '../../generalServices/instructor.service';
import { StudentService } from './../../generalServices/student.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IInstructor } from 'src/app/Interfaces/instructor';
import { Router } from '@angular/router';

@Component({
  selector: 'app-instructor-sign-up',
  templateUrl: './instructor-sign-up.component.html',
  styleUrls: ['./instructor-sign-up.component.scss'],
})
export class InstructorSignUpComponent {
  instructorForm!: FormGroup;
  checkConfirmedPassword: boolean = true;
  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private InstructorService: InstructorService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}
  createForm() {
    this.instructorForm = this.fb.group({
      id: [0, Validators.required],
      name: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern('^[a-zA-Z]+( [a-zA-Z]+)+$'),
      ]],
      Specialization: ['', [
        Validators.required,
        Validators.minLength(4),
    ]],    
      Experience: ['', [
        Validators.required,
        Validators.minLength(50),
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
      this.instructorForm.patchValue({
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
    // this.isEmailUnique();
  }
  onSubmit() {
    const instructorFormData = new FormData();
    Object.keys(this.instructorForm.value).forEach(key => {
      instructorFormData.append(key, this.instructorForm.get(key)?.value);
    });
    console.log(this.instructorForm.value)
    this.InstructorService.addInstructor(instructorFormData).subscribe(
      response => {
        this.snackBar.open('Registration successful', 'Dismiss', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom', 
        });
        this.router.navigate(["/login"]); 
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
}
