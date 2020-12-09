import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from 'src/app/auth/auth.service';
import { RockSchema } from 'src/app/_models/RockSchema';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dialog-schema-details',
  templateUrl: './dialog-schema-details.component.html',
  styleUrls: ['./dialog-schema-details.component.scss']
})
export class DialogSchemaDetailsComponent implements OnInit {
  actualUserId;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: RockSchema,
    private sanitizer: DomSanitizer,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.actualUserId = this.authService.loggedUser.userId;
  }
  
  getURL(URL: string){
    return URL.replace('\\','/');
  }
}
