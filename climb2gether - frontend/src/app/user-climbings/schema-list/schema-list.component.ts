import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { BaseService } from 'src/app/services/base.service';
import { ClimbingSchemaService } from 'src/app/services/climbing-schema.service';
import { RockSchema } from 'src/app/_models/RockSchema';
import { DialogSchemaDetailsComponent } from '../dialog-schema-details/dialog-schema-details.component';

@Component({
  selector: 'app-schema-list',
  templateUrl: './schema-list.component.html',
  styleUrls: ['./schema-list.component.scss']
})
export class SchemaListComponent implements OnInit, OnDestroy {
  name: string = '';
  location: string = '';
  checkIsPublic: boolean = false;
  p: any; //strona paginatora
  fetchedSchemas: RockSchema[] = [];
  pageOfItems: Array<any>;
  schemaSubscription: Subscription;


  constructor(
    private schemaService: ClimbingSchemaService,
    public dialog: MatDialog,
    private baseService: BaseService
  ) { }

  async ngOnInit() {
    this.schemaSubscription = this.schemaService.schemasChanged.subscribe( res => {
      this.fetchedSchemas = res;
    })
    this.fetchedSchemas = await this.schemaService.getUserSchemas();
  }

  async search() {
    let result = await this.schemaService.getUserSchemas(this.name, this.location, this.checkIsPublic);
    if(!result){
      this.baseService.openSnackBar('Brak wyników wyszukiwania');
      this.fetchedSchemas = [];
      return;
    }
    this.fetchedSchemas = result;
    // .then( res => {
    //   this.fetchedSchemas = res;
    // })
    // .catch( err => {
    //   this.baseService.openSnackBar('Brak wyników wyszukiwania');
    //   this.fetchedSchemas = [];
    // });
  }

  check(event: any) {
    this.checkIsPublic = event.checked;
  }

  onChangePage(pageOfItems: Array<any>) {
    // update current page of items
    this.pageOfItems = pageOfItems;
  }

  openDetailsDialog(schemaId: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.maxHeight = '85vh';
    dialogConfig.data = this.fetchedSchemas.find(x => x.id == schemaId);
    this.dialog.open(DialogSchemaDetailsComponent, dialogConfig);
  }

  ngOnDestroy(){
    this.schemaSubscription.unsubscribe();
  }

}
