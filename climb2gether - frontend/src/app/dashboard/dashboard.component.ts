import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  repeat = [0,1,2,3,4,5,6];

  constructor() { }

  ngOnInit(): void {
  }

}
