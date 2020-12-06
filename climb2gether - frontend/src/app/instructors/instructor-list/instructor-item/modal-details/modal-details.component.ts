import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
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

  constructor(
    private instructorsService: InstructorsService,
    @Inject(MAT_DIALOG_DATA) public data: Offer 
    ) { }

    ngOnInit() {
      console.log(this.attatchments)
    }

}
