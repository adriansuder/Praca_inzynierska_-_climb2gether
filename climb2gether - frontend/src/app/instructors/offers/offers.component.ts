import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { ClimbingPartnersService } from 'src/app/services/climbing-partners.service';
import { ExpeditionListItem } from 'src/app/_models/ExpeditionListItem';
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
  loggedUserId: number;
  userExpeditions: ExpeditionListItem[];
  expSubscription: Subscription;
  userRoleName: string;

  constructor(
    public dialog: MatDialog,
    private instructorsService: InstructorsService,
    private router: Router, 
    private route: ActivatedRoute,
    private authService: AuthService,
    private climbingService: ClimbingPartnersService
  ) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  async ngOnInit() {
    this.userExpeditions = await this.climbingService.getUserExpeditions();
    console.log(this.userExpeditions);
    this.expSubscription = this.climbingService.userExpeditionsChanged.subscribe( x => {
      this.userExpeditions = x;
    })
    this.loggedUserId = this.authService.loggedUser.userId;
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
    this.userRoleName = this.authService.loggedUser.roleName;
    
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
    this.expSubscription.unsubscribe();
  }
}



/*


displayedColumns: string[] = ['data', 'trasa', 'iloscMiejsc', 'typ', 'akcje'];
  dataSource = new MatTableDataSource();
  loggedUserId: number;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() expItem: ExpeditionListItem;
  

  constructor(
    public dialog: MatDialog,
    private authService: AuthService
    ) { }

  ngOnInit(): void {
    this.loggedUserId = this.authService.loggedUser.userId;
  }
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  confrimEnrollmentDialog() {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.maxHeight = '70vh';
    dialogConfig.data = this.expItem;
    this.dialog.open(ExpeditionEnrollmentModalComponent, dialogConfig);
  }

*/