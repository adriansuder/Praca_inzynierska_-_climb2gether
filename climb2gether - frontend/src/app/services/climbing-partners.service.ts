import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';
import { Expedition } from '../_models/Expedition';
import { ExpeditionListItem } from '../_models/ExpeditionListItem';
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClimbingPartnersService {
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  allExpeditionsChanged: BehaviorSubject<ExpeditionListItem[]> = new BehaviorSubject<ExpeditionListItem[]>(null);
  userExpeditionsChanged: BehaviorSubject<ExpeditionListItem[]> = new BehaviorSubject<ExpeditionListItem[]>(null);
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) { }

  createExpedition(expedition: Expedition) {
    return this.http.post<any>(
      `${environment.apiUrl}/expeditions`,
      expedition
    ).toPromise();
  }

  getAllExpeditions() {
    return this.http.get<ExpeditionListItem[]>(
      `${environment.apiUrl}/expeditions`
    ).pipe(map(resData => {
      var result = JSON.parse(JSON.stringify(resData));
      result.sort((a, b) => a.creationDate < b.creationDate ? 1 : -1);
      return result;
    }), tap(resData => {
      this.allExpeditionsChanged.next(resData);
    })).toPromise();
  }

  addExpeditionEnrollment(expeditionId: number) {
    return this.http.post<any>(
      `${environment.apiUrl}/expeditions/addEnrollment`,
      {
        participantUserId: this.authService.loggedUser.userId,
        expeditionId
      }
    ).toPromise();
  }

  openSnackBar(message: string) {
    const config = new MatSnackBarConfig();
    config.panelClass = ['snackBarStyle'];
    config.horizontalPosition = this.horizontalPosition;
    config.verticalPosition = this.verticalPosition;
    config.duration = 3000;
    this.snackBar.open(message, 'X', config);
  }

  search(queryRequest: string) {
    return this.http.get<any>(
      `${environment.apiUrl}/expeditions/search?queryRequest=${queryRequest}`
    ).pipe(
      //tap(res => console.log(res))
    ).toPromise();
  }

  getUserExpeditions() {
    return this.http.get<ExpeditionListItem[]>(
      `${environment.apiUrl}/expeditions/user`
    ).pipe(map(resData => {
      var result = JSON.parse(JSON.stringify(resData));
      result.sort((a, b) => a.creationDate < b.creationDate ? 1 : -1);
      return result;
    }), tap(res =>{
      this.userExpeditionsChanged.next(res);
    })).toPromise();
  }

  deleteOffer(expId: number){
    return this.http.delete<any>(
      `${environment.apiUrl}/expeditions/delete?expId=${expId}`
    ).pipe(map(res=> {
      var result = JSON.parse(JSON.stringify(res.message));
      return result;
    })).toPromise();
  }

  deleteOfferEnrollment(expEnrollmentId: number){
    return this.http.delete<any>(
      `${environment.apiUrl}/expeditions/deleteEnrollment?expEnrollmentId=${expEnrollmentId}`
    ).pipe(map(res=> {
      var result = JSON.parse(JSON.stringify(res.message));
      return result;
    })).toPromise();
  }

}
