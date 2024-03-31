import { StudentService } from './../../generalServices/student.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IStudent } from '../../Interfaces/istudent';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-student-edit',
  templateUrl: './student-edit.component.html',
  styleUrls: ['./student-edit.component.scss'],
})
export class StudentEditComponent implements OnInit {
  studentId!: number;
  studentInfo!: IStudent;
  studentForm!: FormGroup;
  checkConfirmedPassword :boolean = true;
  constructor(
    private route: ActivatedRoute,
    private studentService: StudentService,
    private fb: FormBuilder,
    private router: Router,
  ) {
    this.getStudentId();
  }

  ngOnInit(): void {
  }
  createForm(student: any) {
    console.log(student);
    this.studentForm = this.fb.group({
      id: [0, Validators.required],
      name: [student.name, [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern('^[a-zA-Z]+( [a-zA-Z]+)+$'),
      ]],
      age: [student.age, Validators.required],
      title: [student.title, [
        Validators.required,
        Validators.minLength(4),
      ]],
      phone: [student.phone, [
        Validators.required,
        Validators.minLength(11),
        Validators.maxLength(11),
        Validators.pattern('^01[0152]+[0-9]{8,}$'),
      ]],
      address: [student.address, [
        Validators.required,
        Validators.minLength(5),
      ]],
      ssn: [student.ssn, [
        Validators.required,
        Validators.pattern(/^\d{14}$/),
      ]],
      email: [student.email, [
        Validators.required,
        Validators.email,
      ]],
      password: [student.password, [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)
      ]],
      userAttachmentPath: [''],
      imageFile: [null, Validators.required]
    });
  }
  comparePassword() {
    let passwordValue = (document.getElementById("password") as HTMLInputElement).value;
    let confirmPasswordValue = (document.getElementById("confirmPassword") as HTMLInputElement).value;
    console.log(passwordValue);
    console.log(confirmPasswordValue);

    if (passwordValue === confirmPasswordValue) {
      this.checkConfirmedPassword = true;
    } else {
      this.checkConfirmedPassword = false;
    }
  }
  
  
  getStudentId() {
    this.route.paramMap.subscribe((params) => {
      const idString = params.get('id');
      if (idString !== null) {
        // Parse the student ID as a number
        this.studentId = parseInt(idString, 10);
        console.log('Student ID:', this.studentId);
        this.studentService.getStudentById(this.studentId).subscribe((std)=>{
          this.createForm(std);
        })
        
      } else {
        // Handle the case when 'id' parameter is null
        console.error('Student ID is null');
      }
    });
  }
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.studentForm.patchValue({
        imageFile: file
      });
    }
  }
  onSubmit() {
    console.log(this.studentId);
    console.log(this.studentInfo);
    const studentFormData = new FormData();
    Object.keys(this.studentForm.value).forEach(key => {
      studentFormData.append(key, this.studentForm.get(key)?.value);
    });
  
    this.studentService.Edit(this.studentId, studentFormData).subscribe(
      response => {
        this.router.navigate(['/shared/profile']); // Corrected navigation
        console.log('Edit successful', response);
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
