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

  constructor(public dialog: MatDialog, private instructorsService: InstructorsService) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.offerItem.offers);
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
        this.instructorsService.openSnackBar('Super! Twoje zgłoszenie zostało przesłane prawidłowo. :)');
        this.offerItem.offers.find(x => x.id = offerId).isUserAlreadyEnrolled  =true;
      } else {
        isAddedOrDeleted = await this.instructorsService.deleteCourseEnrollment(offerId);
        if (!isAddedOrDeleted) { this.instructorsService.openSnackBar('Coś poszło nie tak!'); }
        this.instructorsService.openSnackBar('Twoje zgłoszenie zostało usunięte.');
        this.offerItem.offers.find(x => x.id = offerId).isUserAlreadyEnrolled  =false;
      }

      if (isAddedOrDeleted) {
        this.instructorsService.getOffers();
      }
    }
  }

}
