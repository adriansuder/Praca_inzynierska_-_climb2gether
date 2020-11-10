import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatTableDataSource } from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import { Offer } from 'src/app/_models/Offer';
import { OfferListItem } from 'src/app/_models/OfferListItem';

// const ELEMENT_DATA: Offer[] = [
//   {data: '2020-09-20', trasa: 'Hydrogen', iloscMiejsc: 1.0079, cena: 500},
//   {data: '2020-09-20', trasa: 'Hydrogen', iloscMiejsc: 1.0079, cena: 500},
//   {data: '2020-09-20', trasa: 'Hydrogen', iloscMiejsc: 1.0079, cena: 500}
// ];

@Component({
  selector: 'app-instructor-item',
  templateUrl: './instructor-item.component.html',
  styleUrls: ['./instructor-item.component.scss'],
  viewProviders: [MatExpansionPanel]
})
export class InstructorItemComponent implements OnInit {
  @Input() offerItem: OfferListItem;
  panelOpenState = false;
  displayedColumns: string[] = ['data', 'trasa', 'iloscMiejsc', 'cena', 'typ','info'];
  dataSource = new MatTableDataSource();

  constructor() { }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.offerItem.offers);
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
