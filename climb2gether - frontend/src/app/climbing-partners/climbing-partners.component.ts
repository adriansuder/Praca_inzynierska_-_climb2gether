import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseService } from '../services/base.service';
import { ClimbingPartnersService } from '../services/climbing-partners.service';
import { ExpeditionListItem } from '../_models/ExpeditionListItem';

@Component({
  selector: 'app-climbing-partners',
  templateUrl: './climbing-partners.component.html',
  styleUrls: ['./climbing-partners.component.scss']
})
export class ClimbingPartnersComponent implements OnInit {
  searchString: string;
  fetchedOffers: ExpeditionListItem[];
  constructor(
    private climbService: ClimbingPartnersService,
    private baseService: BaseService
    ) { }

  async ngOnInit() {
    let temp = await this.climbService.getAllExpeditions();
    this.fetchedOffers = temp.sort((a, b) => a.expeditionDate < b.expeditionDate ? -1 : 1);
  
  }

  async search(){ 
    const result = await this.climbService.search(this.searchString);
    if(result.length == 0){
      this.baseService.openSnackBar('Brak dopasowań wyszukiwania.');
      return;
    }
    this.fetchedOffers = result;
  }

}
