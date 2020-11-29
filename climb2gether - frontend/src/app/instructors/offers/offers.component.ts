import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Offer } from 'src/app/_models/Offer';
import { InstructorsService } from '../../services/instructors.service';
import { ModalParticipantsListComponent } from './modal-participants-list/modal-participants-list.component';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss']
})
export class OffersComponent implements OnInit, OnDestroy {
  userOffersSubscription: Subscription;
  editingModeSubscription: Subscription;
  fetchedUserOffers: Offer[] = [];
  displayedColumns: string[] = ['data', 'trasa', 'iloscMiejsc', 'typ', 'cena', 'akcje'];
  dataSource = new MatTableDataSource();
  inAddingOfferMode ;

  constructor(
    public dialog: MatDialog,
    private instructorsService: InstructorsService,
    private router: Router, 
    private route: ActivatedRoute
  ) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(): void {
    this.instructorsService.getInstructorOffers();
    this.userOffersSubscription = this.instructorsService.userOffersChanged
      .subscribe( data => {
        this.fetchedUserOffers = data;
        this.dataSource = new MatTableDataSource(this.fetchedUserOffers);
        this.dataSource.paginator = this.paginator;
    });
    this.editingModeSubscription = this.instructorsService.inAddingOfferMode
    .subscribe( x => {
      this.inAddingOfferMode = x;
    });

    
  }
  
  ngAfterViewInit(): void {

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  addOffer(){
    this.router.navigate(['addOffer'], {relativeTo: this.route});
    this.instructorsService.inAddingOfferMode.next(true);
  }

  onDeleteOffer(offerId: number){
    this.instructorsService.deleteOffer(offerId).subscribe(res => {
      if(res){
        this.instructorsService.getInstructorOffers();
      }
    })
  }

  openParticipantsListDialog(offerId: number) {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.maxHeight = '70vh';
    dialogConfig.data = offerId;
    this.dialog.open(ModalParticipantsListComponent, dialogConfig);
  }

  ngOnDestroy(){
    this.userOffersSubscription.unsubscribe();
    this.editingModeSubscription.unsubscribe();
  }
}
