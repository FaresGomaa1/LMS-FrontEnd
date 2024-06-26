import { InstructorService } from './../../generalServices/instructor.service';
import { StudentService } from './../../generalServices/student.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IStudent } from '../../Interfaces/istudent';
import { IStudent1 } from '../../Interfaces/student-for-add';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-student-edit',
  templateUrl: './student-edit.component.html',
  styleUrls: ['./student-edit.component.scss'],
})
export class StudentEditComponent implements OnInit {
  studentId!: number;
  studentInfo: any;
  studentForm!: FormGroup;
  checkConfirmedPassword: boolean = true;
  constructor(
    private route: ActivatedRoute,
    private studentService: StudentService,
    private router: Router,
    private formBuilder: FormBuilder,
    private instructorService: InstructorService
  ) {
    this.studentInfo = { 
      name: '', 
      age: 0, 
      title: '', 
      phone: '', 
      address: '', 
      ssn: '', 
      email: '', 
      password: '', 
      userAttachmentPath: '', 
      courseName: [], 
      courseIDs: [], 
      groupName: [], 
      examName: [], 
      examIDs: [],
      results: [],
    };
    
    this.getStudentId();
  }
  

  ngOnInit(): void {
    this.getStudentId();
    this.initializeForm();
  }
  initializeForm() {
    this.studentForm = this.formBuilder.group({
      name: [
        this.studentInfo.name,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern('^[a-zA-Z]+( [a-zA-Z]+)+$'),
        ],
      ],

      age: [this.studentInfo.age, Validators.required],
      title: [
        this.studentInfo.title,
        [Validators.required, Validators.minLength(4)],
      ],
      phone: [
        this.studentInfo.phone,
        [
          Validators.required,
          Validators.minLength(11),
          Validators.maxLength(11),
          Validators.pattern('^01[0152]+[0-9]{8,}$'),
        ],
      ],
      address: [
        this.studentInfo.address,
        [Validators.required, Validators.minLength(5)],
      ],
      ssn: [
        this.studentInfo.ssn,
        [Validators.required, Validators.pattern(/^\d{14}$/)],
      ],
      email: [this.studentInfo.email, [Validators.required, Validators.email]],
      password: [
        this.studentInfo.password,
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/),
        ],
      ]
    });
  }
  comparePassword() {
    let passwordValue = (
      document.getElementById('password') as HTMLInputElement
    ).value;
    let confirmPasswordValue = (
      document.getElementById('confirmPassword') as HTMLInputElement
    ).value;
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
        this.studentService.getStudentById(this.studentId).subscribe((std) => {
          this.studentInfo = std;
          this.initializeForm();
        });
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
        imageFile: file,
      });
    }
  }

  onSubmit() {
  
    // Submit JSON data to studentService.Edit
    this.studentService.Edit(this.studentId, this.studentForm.value).subscribe(
      (response) => {
        this.router.navigate(['/shared/profile']); 
        console.log('Edit successful', response);
      },
      (error) => {
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
