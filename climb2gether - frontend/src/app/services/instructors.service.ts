import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Subject, interval, Subscription } from 'rxjs';
import { map, repeatWhen, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';
import { Offer } from '../_models/Offer';
import { OfferDetails } from '../_models/OfferDetails';
import { OfferListItem } from '../_models/OfferListItem';
import { Participant } from '../_models/Participant';



@Injectable({
  providedIn: 'root'
})
export class InstructorsService implements OnDestroy{

  subscription: Subscription;
  inAddingOfferMode = new Subject<boolean>();
  offersChanged = new Subject<OfferListItem[]>();
  userOffersChanged = new Subject<Offer[]>();
  offerDetailsSubject = new Subject<OfferDetails>();
  OffersSubscription: Subscription;

  fetchedOffers: OfferListItem[] = [];
  fetchedUserOffers: Offer[] = [];

  constructor(private http: HttpClient, private authService: AuthService) { }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getOffers() {
    this.subscription = this.http
      .get<OfferListItem[]>(
        `${environment.apiUrl}/offers`
      ).pipe(map(resData => {
        let offerArray: OfferListItem[] = [];
        offerArray = JSON.parse(JSON.stringify(resData));
        return resData;
      })
        , repeatWhen(() => interval(90000))
        ).subscribe( offers => {
          this.fetchedOffers = offers;
          this.offersChanged.next(offers);
        })
  }

  getUserOfferById(offerId: number){
    return this.http.get<Offer>(
      `${environment.apiUrl}/offer/${offerId}`
    ).toPromise();
  }

  getInstructorOffers() {
    let userId = this.authService.loggedUser.userId;
    this.http.get<Offer[]>(
      `${environment.apiUrl}/offers/user/${userId}`
    ).pipe(map(resData => {
      let userOffersArray: Offer[] = [];
      userOffersArray = JSON.parse(JSON.stringify(resData));
      return userOffersArray;
    }), tap(offers =>
      console.log(offers)
    )).subscribe(offers => {
      this.fetchedUserOffers = offers;
      this.userOffersChanged.next(this.fetchedUserOffers);
    });
  }

  addOffer(offer: Offer, files: Blob) {
    const headers = new HttpHeaders().append('Content-Disposition', 'multipart/form-data');
    var formData = new FormData();
    formData.append('date', offer.date.toLocaleDateString('PL'));
    formData.append('location', offer.location);
    formData.append('maxParticipants', offer.maxParticipants.toString());
    formData.append('price', offer.price.toString());
    formData.append('describe', offer.describe);
    formData.append('offerType', offer.offerType);
    formData.append('offerOwnerUserId', this.authService.loggedUser.userId.toString());
    formData.append('img', files);
    // Array.from(files).forEach(file => { 
    //   formData.append('img', file);
    // });
    return this.http.post(
      `${environment.apiUrl}/offers`,
      formData,
      {headers: headers}
    ).toPromise();
  }

  updateOffer(offer: Offer) {
    return this.http.put(
      `${environment.apiUrl}/offers`,
      offer
    ).toPromise();
  }

  getOfferDetails(offerId: number) {
    return this.http.get(
      `${environment.apiUrl}/offers/details?offerId=${offerId}`
    ).toPromise();
  }

  deleteOffer(offerId: number) {
    return this.http.delete(
      `${environment.apiUrl}/offers/${offerId}`
    );
  }

  addCourseEnrollment(offerId: number) {
    return this.http.post(
      `${environment.apiUrl}/offers/addEnrollment`,
      {
        offerId,
        userId: this.authService.loggedUser.userId
      }
    ).toPromise();
  }

  deleteCourseEnrollment(offerId: number) {
    let userId = this.authService.loggedUser.userId;
    return this.http.delete(
      `${environment.apiUrl}/offers/deleteEnrollment?offerId=${offerId}&userId=${userId}`
    ).toPromise();
  }

  getOfferParticipants(offerId: number) {
    return this.http.get<Participant[]>(
      `${environment.apiUrl}/offers/ParticipantsList?offerId=${offerId}`
    ).pipe(tap(res => console.log(res))).toPromise();
  }

  search(queryRequest: string, dateFrom: string, dateTo: string){
    return this.http.get<any>(
      `${environment.apiUrl}/offer/search?query=${queryRequest}&dateFrom=${dateFrom}&dateTo=${dateTo}`
    ).pipe(
      //tap(res => console.log(res))
    ).toPromise();
  }
}