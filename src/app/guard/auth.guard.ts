// auth.guard.ts

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserLogInService } from '../generalServices/user-log-in.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private userLoginService: UserLogInService) {}

  canActivate(): boolean {
    if (this.userLoginService.isLoggedIn()) {
      return true; 
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
