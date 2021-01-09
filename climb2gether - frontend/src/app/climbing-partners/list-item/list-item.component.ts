import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { BaseService } from 'src/app/services/base.service';
import { ClimbingPartnersService } from 'src/app/services/climbing-partners.service';
import { ExpeditionListItem } from 'src/app/_models/ExpeditionListItem';
import { ExpeditionEnrollmentModalComponent } from '../expedition-enrollment-modal/expedition-enrollment-modal.component';

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss']
})
export class ListItemComponent implements OnInit {
  displayedColumns: string[] = ['data', 'trasa', 'iloscMiejsc', 'typ', 'akcje'];
  dataSource = new MatTableDataSource();
  loggedUserId: number;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() expItem: ExpeditionListItem;
  

  constructor(
    public dialog: MatDialog,
    private authService: AuthService,
    private climbingPartnerService: ClimbingPartnersService,
    private baseService: BaseService,
    private route: ActivatedRoute
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

  async deleteOffer(){
    var result = await this.climbingPartnerService.deleteOffer(this.expItem.id);
    if(!result){
      this.baseService.openSnackBar(result);
      return;
    }
    this.baseService.openSnackBar(result);
    if(this.route.snapshot.url[0].path == 'climbingPartners'){
      this.climbingPartnerService.getAllExpeditions();
    }else if(this.route.snapshot.url[0].path == 'myOffers'){
      this.climbingPartnerService.getUserExpeditions();
    }
  }

}
