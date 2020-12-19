import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from 'src/app/auth/auth.service';
import { BaseService } from 'src/app/services/base.service';
import { ClimbingSchemaService } from 'src/app/services/climbing-schema.service';
import { RockSchema } from 'src/app/_models/RockSchema';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dialog-schema-details',
  templateUrl: './dialog-schema-details.component.html',
  styleUrls: ['./dialog-schema-details.component.scss']
})
export class DialogSchemaDetailsComponent implements OnInit {
  actualUserId;
  imgURL: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: RockSchema,
    private sanitizer: DomSanitizer,
    private authService: AuthService,
    private schemaService: ClimbingSchemaService,
    private baseService: BaseService,
    public dialogRef: MatDialogRef<DialogSchemaDetailsComponent>
  ) { }

  async ngOnInit() {
    this.actualUserId = this.authService.loggedUser.userId;
    console.log(this.data.imgURL)
    this.imgURL = await this.baseService.getAttatchment(this.data.imgURL);
  }
  
  getURL(URL: string){
    return URL.replace('\\','/');
  }

  async deleteSchema(schemaId: number){
    var result = await this.schemaService.deleteSchema(schemaId);
    if(!result){
      this.baseService.openSnackBar("Coś poszło nie tak, spróbuj ponownie.");
      return;
    }
    let schemas = await this.schemaService.getUserSchemas();
    this.schemaService.schemasChanged.next(schemas);
    this.dialogRef.close();
    this.baseService.openSnackBar("Schemat został usunięty.");
  }


}
