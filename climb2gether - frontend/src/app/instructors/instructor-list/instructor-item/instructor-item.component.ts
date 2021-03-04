import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Offer } from 'src/app/_models/Offer';
import { OfferListItem } from 'src/app/_models/OfferListItem';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { ModalDetailsComponent } from './modal-details/modal-details.component';
import { ModalConfirmEnrollmentComponent } from './modal-confirm-enrollment/modal-confirm-enrollment.component';
import { InstructorsService } from '../../../services/instructors.service';
import { BaseService } from 'src/app/services/base.service';
import { AuthService } from 'src/app/auth/auth.service';

// const ELEMENT_DATA: Offer[] = [
//   {data: '2020-09-20', trasa: 'Hydrogen', iloscMiejsc: 1.0079, cena: 500},
//   {data: '2020-09-20', trasa: 'Hydrogen', iloscMiejsc: 1.0079, cena: 500},
//   {data: '2020-09-20', trasa: 'Hydrogen', iloscMiejsc: 1.0079, cena: 500}
// ];

@Component({
  selector: 'app-instructor-item',
  templateUrl: './instructor-item.component.html',
  styleUrls: ['./instructor-item.component.scss'],
  viewProviders: [MatExpansionPanel]
})
export class InstructorItemComponent implements OnInit {
  @Input() offerItem: OfferListItem;
  panelOpenState = false;
  displayedColumns: string[] = ['data', 'trasa', 'iloscMiejsc', 'cena', 'typ', 'info', 'book'];
  dataSource = new MatTableDataSource();
  loggedUserId: number;

  constructor(
    public dialog: MatDialog,
    private instructorsService: InstructorsService,
    private baseSerive: BaseService,
    private authService: AuthService
    ) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.offerItem.offers);
    this.loggedUserId = this.authService.loggedUser.userId;
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDetailsDialog(offerId: number) {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.maxHeight = '70vh';
    dialogConfig.data = this.offerItem.offers.find(x => x.id == offerId);
    this.dialog.open(ModalDetailsComponent, dialogConfig);
  }

  async courseEnrollment(offerId: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.maxHeight = '70vh';
    dialogConfig.data = this.offerItem.offers.find(x => x.id === offerId);

    let result = await this.dialog.open(ModalConfirmEnrollmentComponent, dialogConfig).afterClosed().toPromise();
    
    if (result === 'OK') {
      let isAddedOrDeleted;
      if (!dialogConfig.data.isUserAlreadyEnrolled) {
        isAddedOrDeleted = await this.instructorsService.addCourseEnrollment(offerId);
        //this.offerItem.offers.find(x => x.id == offerId).isUserAlreadyEnrolled = true;
        this.offerItem.offers.filter(x => x.id == offerId)[0].isUserAlreadyEnrolled = true;
        this.baseSerive.openSnackBar('Super! Twoje zgłoszenie zostało przesłane prawidłowo. :)');
      } else {
        isAddedOrDeleted = await this.instructorsService.deleteCourseEnrollment(offerId);
        if (!isAddedOrDeleted) { this.baseSerive.openSnackBar('Coś poszło nie tak!'); }
        //this.offerItem.offers.find(x => x.id == offerId).isUserAlreadyEnrolled = false;
        this.offerItem.offers.filter(x => x.id == offerId)[0].isUserAlreadyEnrolled = false;
        this.baseSerive.openSnackBar('Twoje zgłoszenie zostało usunięte.');

      }

      if (isAddedOrDeleted) {
        this.instructorsService.getOffers();
      }
    }
  }

}
