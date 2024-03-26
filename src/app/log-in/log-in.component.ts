import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserLogInService } from '../generalServices/user-log-in.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-login',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss'],
})
export class LogInComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  error = '';
  tokenKey = 'auth_token';
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
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      const { email, password } = this.loginForm.value;
      this.userLoginService.signIn(email, password).subscribe(
        response => {
          this.loading = false;
          const token = response.token;
          if (token) {
            const helper = new JwtHelperService();
            const decodedToken = helper.decodeToken(token);
            const userRole = decodedToken.role;
            const userType = userRole === 'student' ? 'student' : 'instructor';
            if (userType === 'student') {
              this.router.navigate(['/shared']);
            } else if (userType === 'instructor') {
              this.router.navigate(['/instructor']);
            }
          }
        }
      );
    }
  }
  
}
