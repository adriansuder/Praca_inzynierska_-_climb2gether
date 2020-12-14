import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Conversation } from '../_models/Conversation';


@Injectable({
  providedIn: 'root'
})
export class ChatService {

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

  fetchConversations(){
    return this.http.get(
      `${environment.apiUrl}/conversations`
    ).pipe(
      map(
        res => {
          return JSON.parse(JSON.stringify(res)) as Conversation[];
        }
      )
    ).toPromise();
  }
}
