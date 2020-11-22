import { Component, OnInit } from '@angular/core';
import { InstructorsService } from 'src/app/instructors/instructors.service';
import { OfferDetails } from 'src/app/_models/OfferDetails';

@Component({
  selector: 'app-modal-details',
  templateUrl: './modal-details.component.html',
  styleUrls: ['./modal-details.component.scss']
})
export class ModalDetailsComponent implements OnInit {
  offerDetails: OfferDetails = null;
  constructor(private instructorsService: InstructorsService) { }

  ngOnInit(): void {
    this.instructorsService.getOfferDetails(1);
    this.instructorsService.offerDetailsSubject.subscribe( data => {
      this.offerDetails = data;
    })
  }

}
