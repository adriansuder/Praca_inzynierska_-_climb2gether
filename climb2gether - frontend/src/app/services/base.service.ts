import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
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
    private http: HttpClient
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
}
