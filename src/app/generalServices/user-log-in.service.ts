import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserLogInService {
  domainName: string = 'http://localhost:5050';
  tokenKey = 'auth_token';

  constructor(private http: HttpClient) {}

  signIn(email: string, password: string): Observable<any> {
    const loginData = { email, password };
    const url = `${this.domainName}/Users/signin`;
    return this.http.post<any>(url, loginData).pipe(
      tap((response) => {
        localStorage.setItem(this.tokenKey, response.token);
      }),
      catchError((error) => throwError(error))
    );
  }
  isLoggedIn(): boolean {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const expirationDate = new Date(tokenPayload.exp * 1000);
      return expirationDate > new Date();
    }
    return false;
  }
}
