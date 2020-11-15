import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, mapTo, tap } from 'rxjs/operators';
import { Tokens } from '../_models/Tokens';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../_models/user';
import { LoggedUser } from '../_models/LoggedUser';
import { Router } from '@angular/router';

export interface AuthResponseData {
  token: string;
  refreshToken: string;
  userId: number;
  expiresIn: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly JWT_TOKEN = 'Token';

  user = new BehaviorSubject<LoggedUser>(null);
  private jwtExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) { }

  login(user: { username: string, password: string }) {
    return this.http.post<AuthResponseData>(`${environment.apiUrl}/login`, user)
      .pipe(
        tap(authRes => this.setLoggedUser(authRes.token, authRes.refreshToken, authRes.userId, authRes.expiresIn)),
        catchError(this.handleResponseError)
      );
  }

  automaticLogin() {
    const userData: LoggedUser = JSON.parse(localStorage.getItem('userData'));

    if (!userData) {
      return;
    }
    const loggedUser = new LoggedUser(userData.token, userData.refreshToken, userData.userId, userData.expiresIn);
    this.user.next(loggedUser);
    this.router.navigate(['dashboard/posts']);
  }

  register(newUser: { email: string, password: string, name: string, username: string, sex: string, surname: string, roleId: number, dateOfBirth: Date, phoneNumber: string }) {
    return this.http.post<AuthResponseData>(`${environment.apiUrl}/register`, newUser)
      .pipe(
        tap(authRes => this.setLoggedUser(authRes.token, authRes.refreshToken, authRes.userId, authRes.expiresIn)),
        catchError(this.handleResponseError)
      );
  }

  logout() {
    return this.http.post<any>(`${environment.apiUrl}/logout`, {
      'refreshToken': this.getRefreshToken()
    }).pipe(tap( () => {
      this.handleLogout();
    }), catchError(this.handleResponseError ))

  }

  getJwtToken() {
    return localStorage.getItem(this.JWT_TOKEN);
  }

  // isLoggedIn() {
  //   return !!this.getJwtToken();
  // }

  refreshToken() {
    return this.http.post<any>(`${environment.apiUrl}/refresh`, {
      'refreshToken': this.getRefreshToken()
    }).pipe(tap((tokens: Tokens) => {
      this.storeJwtToken(tokens.token);
    }));
  }

  getUserRoles() {
    return this.http.get<{Id: number, RoleName: string, isAdmin: boolean }[]>(`${environment.apiUrl}/userRoles`).toPromise();
  }

  private setLoggedUser(token: string, refreshToken: string, userId: number, expiresIn: Date) {
    const user = new LoggedUser(token, refreshToken, userId, expiresIn);
    this.user.next(user);
    //this.autoLogout(expiresIn)
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleResponseError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!'
    if (!error.error || !error.error.error) {
      return throwError(errorMessage)
    }
    switch (error.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email exists already!';
    }
    return throwError(errorMessage);
  }

  private storeJwtToken(token: string) {
    localStorage.setItem(this.JWT_TOKEN, token)
  }

  private getRefreshToken() {
    var userData:LoggedUser = JSON.parse(localStorage.getItem('userData'));
    return userData.refreshToken;
  }

  private handleLogout() {
    localStorage.removeItem('userData');
    this.user.next(null);
    this.router.navigate(['']);

  }


}