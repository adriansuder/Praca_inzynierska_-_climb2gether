import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map,tap } from 'rxjs/operators';
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

@Injectable({
  providedIn: 'root'
})
export class ClimbingPartnersService {
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';


  constructor(
    private http: HttpClient, 
    private authService: AuthService,
    private snackBar: MatSnackBar
    ) { }

  createExpedition(expedition: Expedition){
    return this.http.post<any>(
      `${environment.apiUrl}/expeditions`,
      expedition
    ).toPromise();
  }

   getAllExpeditions() {
    return this.http.get<any>(
      `${environment.apiUrl}/expeditions`
    ).pipe(map(resData => {
      var result = JSON.parse(JSON.stringify(resData));
      result.sort((a, b) => a.creationDate < b.creationDate ? 1 : -1);
      return result;
    }), tap(resData => console.log(resData))).toPromise();
  }

  addExpeditionEnrollment(expeditionId: number){
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

  search(queryRequest: string){
    return this.http.get<any>(
      `${environment.apiUrl}/expeditions/search?queryRequest=${queryRequest}`
    ).pipe(
      //tap(res => console.log(res))
    ).toPromise();
  }
}
