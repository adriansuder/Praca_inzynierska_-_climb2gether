import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ClimbingPartnersService } from 'src/app/services/climbing-partners.service';
import { ExpeditionListItem } from 'src/app/_models/ExpeditionListItem';

@Component({
  selector: 'app-expedition-enrollment-modal',
  templateUrl: './expedition-enrollment-modal.component.html',
  styleUrls: ['./expedition-enrollment-modal.component.scss']
})
export class ExpeditionEnrollmentModalComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ExpeditionListItem,
    private climbService: ClimbingPartnersService,
    public dialogRef: MatDialogRef<ExpeditionEnrollmentModalComponent>
  ) { }

  ngOnInit(): void {
  }

  async confirm() {
    await this.climbService.addExpeditionEnrollment(this.data.id)
      .then( response => {
        this.dialogRef.close();
        this.climbService.openSnackBar("Twoje zgłoszenie zostało przesłane!");
      }, err => {
        this.dialogRef.close();
        this.climbService.openSnackBar(err.error);
        console.log(err.error);
      }
      );
  }
}
