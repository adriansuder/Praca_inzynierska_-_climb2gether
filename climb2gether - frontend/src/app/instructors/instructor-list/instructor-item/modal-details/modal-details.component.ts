import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { BaseService } from 'src/app/services/base.service';
import { InstructorsService } from 'src/app/services/instructors.service';
import { Offer } from 'src/app/_models/Offer';
import { OfferDetails } from 'src/app/_models/OfferDetails';
import { OfferListItem } from 'src/app/_models/OfferListItem';

@Component({
  selector: 'app-modal-details',
  templateUrl: './modal-details.component.html',
  styleUrls: ['./modal-details.component.scss']
})
export class ModalDetailsComponent implements OnInit {
  attatchments: any = this.data.attatchments;
  imgURL:any;
  constructor(
    private instructorsService: InstructorsService,
    private baseService: BaseService,
    @Inject(MAT_DIALOG_DATA) public data: Offer 
    ) { }

    async ngOnInit() {
      this.imgURL = await this.baseService.getAttatchment(this.attatchments[0].id);
    }   
}
