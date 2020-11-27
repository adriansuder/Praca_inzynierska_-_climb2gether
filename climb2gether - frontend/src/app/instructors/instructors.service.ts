import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, interval } from 'rxjs';
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
export class InstructorsService {

  inAddingOfferMode = new Subject<boolean>();
  offersChanged = new Subject<OfferListItem[]>();
  userOffersChanged = new Subject<Offer[]>();
  offerDetailsSubject = new Subject<OfferDetails>();

  fetchedOffers: OfferListItem[] = [];
  fetchedUserOffers: Offer[] = [];

  constructor(private http: HttpClient, private authService: AuthService) { }

  getOffers() {
    this.http
      .get<OfferListItem[]>(
        `${environment.apiUrl}/offers`
      ).pipe(map(resData => {
        let offerArray: OfferListItem[] = [];
        offerArray = JSON.parse(JSON.stringify(resData));
        return offerArray;
      })
        , tap(offers => {
          console.log(offers);
        })
        , repeatWhen(() => interval(10000))
        ).subscribe(offers => {
          this.fetchedOffers = offers;
          this.offersChanged.next(this.fetchedOffers);
        });
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

  addOffer(offer: Offer) {
    return this.http.post(
      `${environment.apiUrl}/offers`,
      offer
    ).toPromise();
  }

  updateOffer(offer: Offer) {
    return this.http.put(
      `${environment.apiUrl}/offers`,
      offer
    ).toPromise();
  }

  getOfferDetails(offerId: number) {
    this.http.get(
      `${environment.apiUrl}/offers/details?offerId=${offerId}`
    ).subscribe(resData => {
      this.offerDetailsSubject.next(JSON.parse(JSON.stringify(resData)));
    });
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
}