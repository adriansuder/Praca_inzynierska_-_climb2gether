import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { PrivateUserInfo } from '../_models/PrivateUserInfo';
import { PublicUserInfo } from '../_models/PublicUserInfo';
import { UserReviews } from '../_models/UserReviews';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  searchResultList: PublicUserInfo[] = [];
  usersSearchResultChanged = new Subject<PublicUserInfo[]>();
  userReviewsChanged = new Subject<UserReviews[]>();

  constructor(
    private http: HttpClient
  ) { }

  getPrivateUserInfo() {
    return this.http.get<PrivateUserInfo>(
      `${environment.apiUrl}/user/privateDetails`
    ).pipe(tap(res => console.log(res))).toPromise();
  }

  getUserDetails(userId: number) {
    return this.http.get<PrivateUserInfo>(
      `${environment.apiUrl}/user/privateDetails?userId=${userId}`
    ).toPromise();
  }

  addReview(grade: number, id: number, comment: string) {
    const userId: number = +id;
    return this.http.post<number>(
      `${environment.apiUrl}/user/createReview`,
      {
        grade,
        userId,
        comment
      }
    ).toPromise();
  }

  usersSearch(query: string){
    return this.http.get<PublicUserInfo[]>(
      `${environment.apiUrl}/user/search?queryString=${query}`
    ).pipe(tap( res => {
      this.usersSearchResultChanged.next(res);
    })).toPromise();
  }

  getUserComments(userId: number){
    return this.http.get<UserReviews[]>(
      `${environment.apiUrl}/user/reviews?userId=${userId}`
    ).pipe(tap(res => {
      this.userReviewsChanged.next(res);
    })).toPromise();
  }

  deleteReview(reviewId: number){
    return this.http.delete<UserReviews[]>(
      `${environment.apiUrl}/user/deleteReview?reviewId=${reviewId}`
    ).toPromise();
  }

  async updateUserInfo(userPhotoStatus: string, phone: string, city: string, oldPassword?: string, password?: string, userPhoto?: any) {
    const headers = new HttpHeaders().append('Content-Disposition', 'multipart/form-data');
    var formData = new FormData();
    formData.append('userPhotoStatus', userPhotoStatus);
    formData.append('phone', phone);
    formData.append('city', city);
    if (oldPassword) {
      formData.append('oldPassword', oldPassword);
      formData.append('password', password);
    }
    if (userPhoto) {
      formData.append('img', await (await fetch(userPhoto)).blob());
    }

    return this.http.put(
      `${environment.apiUrl}/user/update`,
      formData,
      {
        headers
      }
    ).toPromise();
  }
}
