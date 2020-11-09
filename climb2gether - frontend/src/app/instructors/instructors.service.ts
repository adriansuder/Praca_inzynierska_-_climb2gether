import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Offer } from '../_models/Offer';
import { OfferListItem } from '../_models/OfferListItem';
import { DataStorageService } from '../_shared/data-storage/data-storage.service';


@Injectable({
  providedIn: 'root'
})
export class InstructorsService {

  
  offersChanged = new Subject<OfferListItem[]>();
  userOffersChanged = new Subject<Offer[]>();

  private fetchedOffers: OfferListItem[] = [];
  private fetchedUserOffers: Offer[] = [];

  constructor(private dataStorage: DataStorageService) { }

  getOffers(){
    this.dataStorage.fetchOffers().subscribe( offers => {
      this.fetchedOffers = offers;
      this.offersChanged.next(this.fetchedOffers.slice());
  });
  }

  getInstructorOffers(userId: number){
    this.dataStorage.fetchInstructorOffers(userId).subscribe( offers => {
      this.fetchedUserOffers = offers;
      this.userOffersChanged.next(this.fetchedUserOffers.slice());
    });
  }

}
