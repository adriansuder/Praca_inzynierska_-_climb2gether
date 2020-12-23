import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import { BaseService } from '../services/base.service';
import { InstructorsService } from '../services/instructors.service';

@Component({
  selector: 'app-instructors',
  templateUrl: './instructors.component.html',
  styleUrls: ['./instructors.component.scss']
})

export class InstructorsComponent implements OnInit {
  searchString: string;
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
    const result = await this.instructorsService.search(this.searchString);
    if(result.length == 0){
      this.baseService.openSnackBar('Brak dopasowań wyszukiwania.');
      return;
    }
    this.instructorsService.offersChanged.next(result);
  }
}
