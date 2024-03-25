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

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private instructorService: InstructorService,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.loginForm = this.fb.group({
      userType: ['student', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }
  onSubmit(): void {
    if (this.loginForm.valid) {
    }
  }
}
