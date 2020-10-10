import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, mapTo, tap } from 'rxjs/operators';
import { Tokens } from '../_models/Tokens';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private readonly REFRESH_TOKEN = 'REFRESH_TOKEN';
  private loggedUser: string;

  constructor(private http: HttpClient) { }

  login(user: {username: string, password: string}): Observable<boolean>{
    return this.http.post<any>(`${environment.apiUrl}/login`, user)
    .pipe(
      tap(tokens => this.doLoginUser(user.username, tokens)),
      mapTo(true),
      catchError(error => {
        alert(error.error);
        return of(false);
      })
    );
  }

  register(newUser: {email: string, password: string, name: string, username: string, sex: string, surname: string, roleId: number, dateOfBirth: Date, phoneNumber: string  }): Observable<boolean>{
    return this.http.post<any>(`${environment.apiUrl}/register`, newUser)
    .pipe(
      tap(tokens => this.doLoginUser(newUser.username, tokens)),
      mapTo(true),
      catchError(error => {
        alert(error.error);
        return of(false);
      })
    );
  }

  logout() {
    return this.http.post<any>(`${environment.apiUrl}/logout`, {
      'refreshToken': this.getRefreshToken()
    }).pipe(
      tap(() => this.doLogoutUser()),
      mapTo(true),
      catchError(error => {
        alert(error.error);
        return of(false);
      }));
  }

  getJwtToken() {
    return localStorage.getItem(this.JWT_TOKEN);
  }

  isLoggedIn() {
    return !!this.getJwtToken();
  }
  
  refreshToken() {
    return this.http.post<any>(`${environment.apiUrl}/refresh`, {
      'refreshToken': this.getRefreshToken()
    }).pipe(tap((tokens: Tokens) => {
      this.storeJwtToken(tokens.token);
    }));
  }

  getUserRoles(){
    return this.http.get<any>(`${environment.apiUrl}/userRoles`).toPromise();
  }

  private doLoginUser(username: string, tokens: Tokens){
    this.loggedUser = username;
    this.storeTokens(tokens);
  }

  private storeTokens(tokens: Tokens){
    localStorage.setItem(this.JWT_TOKEN, tokens.token);
    localStorage.setItem(this.REFRESH_TOKEN, tokens.refreshToken);
  }

  private storeJwtToken(jwt: string) {
    localStorage.setItem(this.JWT_TOKEN, jwt);
  }

  private doLogoutUser(){
    this.loggedUser = null;
    console.log('zalogowamy: ' + this.loggedUser)
    this.removeTokens();
  }

  private removeTokens(){
    localStorage.removeItem(this.JWT_TOKEN);
    localStorage.removeItem(this.REFRESH_TOKEN);
  }

  private getRefreshToken(){
    console.log('logging out1 '+ localStorage.getItem(this.REFRESH_TOKEN));
    return localStorage.getItem(this.REFRESH_TOKEN);
  }


}
