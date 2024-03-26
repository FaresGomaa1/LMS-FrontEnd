import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserLogInService } from '../generalServices/user-log-in.service';

@Component({
  selector: 'app-login',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss'],
})
export class LogInComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private userLoginService: UserLogInService,
    private router: Router
  ) {}

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
      console.log(this.loginForm.valid);
      this.loading = true;
      const { userType, email, password } = this.loginForm.value;
      this.userLoginService.signIn(email, password).subscribe(
        response => {
          this.loading = false;
          if (userType === 'student') {
            console.log("student logged");
            this.router.navigate(['/shared']);
          } else if (userType === 'instructor') {
            this.router.navigate(['/instructor']);
          }
        }
      );
    }
  }
}
