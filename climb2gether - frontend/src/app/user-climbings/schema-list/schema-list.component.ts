import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ClimbingSchemaService } from 'src/app/services/climbing-schema.service';
import { RockSchema } from 'src/app/_models/RockSchema';
import { DialogSchemaDetailsComponent } from '../dialog-schema-details/dialog-schema-details.component';

@Component({
  selector: 'app-schema-list',
  templateUrl: './schema-list.component.html',
  styleUrls: ['./schema-list.component.scss']
})
export class SchemaListComponent implements OnInit {
  fetchedSchemas: RockSchema[] = [];
  pageOfItems: Array<any>;
  constructor(
    private schemaService: ClimbingSchemaService,
    public dialog: MatDialog
  ) { }

  async ngOnInit() {
    this.fetchedSchemas = await this.schemaService.getUserSchemas();
    console.log(this.fetchedSchemas);
  }

  onChangePage(pageOfItems: Array<any>) {
    // update current page of items
    this.pageOfItems = pageOfItems;
  }

  openDetailsDialog(schemaId: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.maxHeight = '70vh';
    dialogConfig.data = this.fetchedSchemas.find(x => x.id == schemaId);
    this.dialog.open(DialogSchemaDetailsComponent, dialogConfig);
  }

}
