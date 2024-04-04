import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  tokenKey = 'auth_token';
  key: string;

  constructor(private router: Router) {
    this.key = localStorage.getItem('auth_token') as string;
    this.updateLoginStatus();
  }

  updateLoginStatus() {
    let element = document.getElementById('checkLogin');
    if (element) {
      if (this.key) {
        element.innerText = 'Log-Out';
      } else {
        element.innerText = 'Log-In';
      }
    }
  }

  deleteKey() {
    if (this.key) {
      localStorage.removeItem(this.tokenKey);
      this.key = '';
      this.updateLoginStatus();
    } else {
      this.router.navigateByUrl('/login');
    }
  }
}