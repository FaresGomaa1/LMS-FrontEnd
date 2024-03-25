import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StudentService } from './../generalServices/student.service';
import { InstructorService } from '../generalServices/instructor.service';
import { IStudent } from '../Interfaces/istudent';
import { IInstructor } from '../instructor/interface/i-instructor';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss'],
})
export class LogInComponent implements OnInit {
  loginForm!: FormGroup;
  allStudents: IStudent[] = [];
  allInstructors: IInstructor[] = [];

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private instructorService: InstructorService,
    private router: Router
  ) {
    this.instructorService.getAllInstructors().subscribe((data)=>{
      this.allInstructors = data;
    })
    console.log(this.allInstructors)
  }

  ngOnInit(): void {
    this.initForm();
    this.loadUsers();
  }

  initForm(): void {
    this.loginForm = this.fb.group({
      userType: ['student', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  loadUsers(): void {
    const userType = this.loginForm.value.userType;
    if (userType === 'student') {
      this.studentService.getAllStudents().subscribe((students: IStudent[]) => {
        this.allStudents = students;
      });
    } else {
      this.instructorService
        .getAllInstructors()
        .subscribe((instructors: IInstructor[]) => {
          this.allInstructors = instructors;
          console.log(this.allInstructors);
        });
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const userType = this.loginForm.value.userType;
      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;

      if (userType === 'student') {
        const student = this.allStudents.find(
          (student) => student.email === email && student.password === password
        );
        if (student) {
          localStorage.setItem('userId', student.id.toString());
          localStorage.setItem('userType', this.loginForm.value.userType.toString());
          this.router.navigate(['/shared/home']);
        } else {
          console.log("student")
          alert('Invalid email or password');
        }
      } else {
        const instructor = this.allInstructors.find(
          (instructor) =>
            instructor.email === email && instructor.password === password
        );
        if (instructor) {
          localStorage.setItem('userId', instructor.id.toString());
          localStorage.setItem('userType', this.loginForm.value.userType.toString());
          this.router.navigate(['/instructor']);
        } else {
          alert('Invalid email or password');
        }
      }
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
