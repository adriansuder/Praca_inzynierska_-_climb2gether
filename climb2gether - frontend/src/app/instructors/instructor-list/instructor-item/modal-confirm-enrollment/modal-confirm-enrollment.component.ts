import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Offer } from 'src/app/_models/Offer';

@Component({
  selector: 'app-modal-confirm-enrollment',
  templateUrl: './modal-confirm-enrollment.component.html',
  styleUrls: ['./modal-confirm-enrollment.component.scss']
})
export class ModalConfirmEnrollmentComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Offer, //offerId
    private dialogRef: MatDialogRef<ModalConfirmEnrollmentComponent>
    ) { }

  ngOnInit(): void {

  }

  confirmDialog(){
    this.dialogRef.close('OK');
  }

}
