import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ClimbingPartnersService } from 'src/app/services/climbing-partners.service';
import { Participant } from 'src/app/_models/Participant';

@Component({
  selector: 'app-participant-list-modal',
  templateUrl: './participant-list-modal.component.html',
  styleUrls: ['./participant-list-modal.component.scss']
})
export class ParticipantListModalComponent implements OnInit {
  
  participants: Participant[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: number,
    private climbingPartners: ClimbingPartnersService
    ) { }

  async ngOnInit() {
    this.participants = await this.climbingPartners.getExpeditionParticipants(this.data);
  }

  async deleteParticipant(enrollmentId: number){
    let result = await this.climbingPartners.deleteOfferEnrollment(enrollmentId);
    if(result){
      
    }
  }

}
