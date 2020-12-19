import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { interval, Subject } from 'rxjs';
import { map, repeatWhen } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Notification } from '../_models/Notification';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  newNotifications = new Subject<Notification[]>();
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  
  constructor(
    private snackBar: MatSnackBar,
    private http: HttpClient,
    private sanitizer: DomSanitizer
    ) { }

  openSnackBar(message: string) {
    const config = new MatSnackBarConfig();
    config.panelClass = ['snackBarStyle'];
    config.horizontalPosition = this.horizontalPosition;
    config.verticalPosition = this.verticalPosition;
    config.duration = 3000;
    this.snackBar.open(message, 'X', config);
  }

  getUserNotifications(){
    this.http.get<Notification[]>(
      `${environment.apiUrl}/notifications`
    ).pipe(
    repeatWhen(() => interval(10000)))
    .subscribe(res => {
      this.newNotifications.next(res);
    })
  }

  setNotificationsReaded(){
    return this.http.post<any>(
      `${environment.apiUrl}/notifications/readed`,
      {readed: true}
    ).toPromise();
  }

  getAttatchment(id: string){
    return this.http.get(
      `${environment.apiUrl}/attatchment/${id}`,
      { responseType: 'text' }
    ).pipe(map(res => {
      return this.sanitizer.bypassSecurityTrustUrl(res);
    })).toPromise();
  }
}
