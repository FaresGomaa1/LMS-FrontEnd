import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserLogInService } from '../generalServices/user-log-in.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class checkUserRoleGuard implements CanActivate {
  tokenKey = 'auth_token';
  constructor(
    private router: Router,
    private userLoginService: UserLogInService
  ) {}

  canActivate(): boolean {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      const helper = new JwtHelperService();
      const decodedToken = helper.decodeToken(token);
      const userRole = decodedToken.role;
      if (userRole === "student"){
        localStorage.setItem('userRole',userRole);
        this.router.navigate(['/shared']);
        return true;
      } else {
        localStorage.setItem('userRole',userRole);
        this.router.navigate(['/instructor']);
        return true;
      }
    } else {
      this.router.navigate(['/login']);
      return false;
    }

  }
}
