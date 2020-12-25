import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { PrivateUserInfo } from '../_models/PrivateUserInfo';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private http: HttpClient
  ) { }

  getPrivateUserInfo(){
    return this.http.get<PrivateUserInfo>(
      `${environment.apiUrl}/user/privateDetails`
    ).pipe(tap(res => console.log(res))).toPromise();
  }
}
