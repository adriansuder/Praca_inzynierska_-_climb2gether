import { Component, OnInit } from '@angular/core';
import { BaseService } from '../services/base.service';
import { InstructorsService } from '../services/instructors.service';

@Component({
  selector: 'app-instructors',
  templateUrl: './instructors.component.html',
  styleUrls: ['./instructors.component.scss']
})

export class InstructorsComponent implements OnInit {
  searchString: string;
  dateFrom: Date;
  dateTo: Date;
  minDate:Date = new Date();

  constructor(
    private instructorsService: InstructorsService,
    private baseService: BaseService
  ) { }

  ngOnInit(): void {
  }
  
  async search(){
    if(!this.searchString || this.searchString == ' '){
      return;
    }
    const result = await this.instructorsService.search(this.searchString, this.dateFrom?.toLocaleString().substring(0,10) , this.dateTo?.toLocaleString().substring(0,10));
    if(result.length == 0){
      this.baseService.openSnackBar('Brak dopasowań wyszukiwania.');
      return;
    }
    this.instructorsService.offersChanged.next(result);
  }

}
