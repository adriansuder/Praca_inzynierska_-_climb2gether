import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';
import { RegisterDialogComponent } from '../register-dialog/register-dialog.component';
import { Router } from '@angular/router';



@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})

export class NavbarComponent implements OnInit {

  title;
  constructor(private dialog: MatDialog, private router: Router) {}

  ngOnInit(): void {
  }

  openLoginDialog() {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;

    this.dialog.open(LoginDialogComponent, dialogConfig);
  }

  openRegisterDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;

    this.dialog.open(RegisterDialogComponent, dialogConfig);
  }

  checkIfUserIsLoggedIn():boolean{
    if(this.router.url === '/dashboard'
      || this.router.url === '/climbingPartners'
      || this.router.url === '/instructors'
      || this.router.url === '/userClimbings' ){
      return true;
    }
    else{
      return false;
    }
  }

}
