import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Participant } from 'src/app/_models/Participant';
import { InstructorsService } from '../../instructors.service';

@Component({
  selector: 'app-modal-participants-list',
  templateUrl: './modal-participants-list.component.html',
  styleUrls: ['./modal-participants-list.component.scss']
})
export class ModalParticipantsListComponent implements OnInit {
  participantsList: Participant[] = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: number,
    private instructorsService: InstructorsService
  ) { }

  ngOnInit() {
    this.fetchList();
  }

  async fetchList(){
    this.participantsList = await this.instructorsService.getOfferParticipants(this.data);
  }
}
