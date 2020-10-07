import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';
import { RegisterDialogComponent } from '../register-dialog/register-dialog.component';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';



@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})

export class NavbarComponent implements OnInit {

  notificationsMock: string[] = ['Użytkownik XYZ obserwuje Cie', 'Użytkownik XYZ zareagował na Twój wpis' , 'Użytkownik XYZ zareagował na Twój wpis',  'Użytkownik XYZ zareagował na Twój wpis',  'Użytkownik XYZ zareagował na Twój wpis'];
  
  constructor(
    private dialog: MatDialog, 
    private router: Router,
    private auth: AuthService
    ) {}

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
      || this.router.url === '/userClimbings' 
      || this.router.url === '/userSettings'
      || this.router.url === '/chat' ){
      return true;
    }
    else{
      return false;
    }
  }

  logout (){

  this.auth.logout();
   
  }

}
