import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register-dialog',
  templateUrl: './register-dialog.component.html',
  styleUrls: ['./register-dialog.component.scss']
})
export class RegisterDialogComponent implements OnInit {

  hide = true;

  accountTypes: string[] = ['wspinacz', 'instruktor', 'przewodnik'];

  constructor() { }

  ngOnInit(): void {
  }


}
