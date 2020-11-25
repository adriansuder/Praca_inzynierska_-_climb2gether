import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InstructorsService } from 'src/app/instructors/instructors.service';
import { OfferDetails } from 'src/app/_models/OfferDetails';

@Component({
  selector: 'app-modal-details',
  templateUrl: './modal-details.component.html',
  styleUrls: ['./modal-details.component.scss']
})
export class ModalDetailsComponent implements OnInit {
  offerDetails: OfferDetails = null;
  constructor(
    private instructorsService: InstructorsService,
    @Inject(MAT_DIALOG_DATA) public data: any //offerId
    ) { }

  ngOnInit(): void {
    this.instructorsService.getOfferDetails(this.data);
    this.instructorsService.offerDetailsSubject.subscribe( data => {
      this.offerDetails = data;
    });
  }

}
