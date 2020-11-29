import { Component, OnInit, ViewChild } from '@angular/core';
import { ClimbingPartnersService } from '../services/climbing-partners.service';
import { ExpeditionListItem } from '../_models/ExpeditionListItem';

@Component({
  selector: 'app-climbing-partners',
  templateUrl: './climbing-partners.component.html',
  styleUrls: ['./climbing-partners.component.scss']
})
export class ClimbingPartnersComponent implements OnInit {

  fetchedOffers: ExpeditionListItem[];
  constructor(private climbService: ClimbingPartnersService) { }

  ngOnInit() {
    this.fetchOffers();
  }

  private async fetchOffers(){
    this.fetchedOffers = await this.climbService.getAllExpeditions();
  }

}
