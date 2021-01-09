import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { BaseService } from '../services/base.service';
import { ClimbingPartnersService } from '../services/climbing-partners.service';
import { ExpeditionListItem } from '../_models/ExpeditionListItem';

@Component({
  selector: 'app-climbing-partners',
  templateUrl: './climbing-partners.component.html',
  styleUrls: ['./climbing-partners.component.scss']
})
export class ClimbingPartnersComponent implements OnInit, OnDestroy {
  searchString: string;
  fetchedOffers: ExpeditionListItem[];
  expSubscription: Subscription;
  constructor(
    private climbService: ClimbingPartnersService,
    private baseService: BaseService
    ) { }


  async ngOnInit() {
    this.fetchedOffers = await this.climbService.getAllExpeditions();
    this.expSubscription = this.climbService.allExpeditionsChanged.subscribe( x => {
      this.fetchedOffers = x;
    })
  }

  async search(){ 
    const result = await this.climbService.search(this.searchString);
    if(result.length == 0){
      this.baseService.openSnackBar('Brak dopasowań wyszukiwania.');
      return;
    }
    this.fetchedOffers = result;
  }

  ngOnDestroy(): void {
    this.expSubscription.unsubscribe();
  }

}
