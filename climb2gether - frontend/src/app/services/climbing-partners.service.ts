import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map,tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';
import { Expedition } from '../_models/Expedition';
import { ExpeditionListItem } from '../_models/ExpeditionListItem';

@Injectable({
  providedIn: 'root'
})
export class ClimbingPartnersService {

  constructor(private http: HttpClient, private authService: AuthService) { }

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
      return JSON.parse(JSON.stringify(resData));
    }), tap(resData => console.log(resData))).toPromise();
  }
}
