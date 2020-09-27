import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';


export interface offers {
  data: string;
  trasa: string;
  iloscMiejsc: number;
  cena: number;
}

const ELEMENT_DATA: offers[] = [
  {data: '2020-09-20', trasa: 'Hydrogen', iloscMiejsc: 1.0079, cena: 500},
  {data: '2020-09-20', trasa: 'Hydrogen', iloscMiejsc: 1.0079, cena: 500},
  {data: '2020-09-20', trasa: 'Hydrogen', iloscMiejsc: 1.0079, cena: 500}
];

@Component({
  selector: 'app-instructors',
  templateUrl: './instructors.component.html',
  styleUrls: ['./instructors.component.scss']
})

export class InstructorsComponent implements OnInit {
  panelOpenState = false;
  repeat = 5;

  displayedColumns: string[] = ['data', 'trasa', 'iloscMiejsc', 'cena', 'zarezerwuj'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  constructor() { }

  ngOnInit(): void {
  }

}
