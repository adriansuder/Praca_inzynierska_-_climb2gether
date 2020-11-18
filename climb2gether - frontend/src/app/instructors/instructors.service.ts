import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Offer } from '../_models/Offer';
import { OfferListItem } from '../_models/OfferListItem';


@Injectable({
  providedIn: 'root'
})
export class InstructorsService {

  inAddingOfferMode = new Subject<boolean>();
  offersChanged = new Subject<OfferListItem[]>();
  userOffersChanged = new Subject<Offer[]>();

  private fetchedOffers: OfferListItem[] = [];
  private fetchedUserOffers: Offer[] = [];

  constructor(private http: HttpClient) { }

  getOffers(){
  this.http
  .get<OfferListItem[]>(
    'https://angular-course-d48e0.firebaseio.com/Offers.json'
  ).pipe(map(resData => {
    let offerArray: OfferListItem[] = [];
    offerArray = JSON.parse(JSON.stringify(resData));
    return offerArray;
  })
    , tap(offers => {
      console.log(offers);
    })).subscribe(offers => {
          this.fetchedOffers = offers;
          this.offersChanged.next(this.fetchedOffers);
      });
  }

  getInstructorOffers(userId: number){
    this.http.get<Offer[]>(
      'https://angular-course-d48e0.firebaseio.com/Offers/0/offers.json'
    ).pipe(map(resData => {
      let userOffersArray: Offer[] = [];
      userOffersArray = JSON.parse(JSON.stringify(resData));
      return userOffersArray;
    }), tap( offers =>
      console.log(offers)
    )).subscribe(offers => {
        this.fetchedUserOffers = offers;
        this.userOffersChanged.next(this.fetchedUserOffers.slice());
      });
  }

  onAddOffer(offer: Offer){
    this.http.put(
      'https://angular-course-d48e0.firebaseio.com/NewOffers.json',
      offer
    ).subscribe( resData => {
      console.log(resData);
    });
  }
}