import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';
import { RegisterDialogComponent } from '../register-dialog/register-dialog.component';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';
import { BaseService } from 'src/app/services/base.service';
import { Notification } from 'src/app/_models/Notification';



@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})

export class NavbarComponent implements OnInit {

  notifications: Notification[] = [];
  newNotificationsNumber: number = 0;
  notificationsMock: string[] = ['Użytkownik XYZ obserwuje Cie', 'Użytkownik XYZ zareagował na Twój wpis' , 'Użytkownik XYZ zareagował na Twój wpis',  'Użytkownik XYZ zareagował na Twój wpis',  'Użytkownik XYZ zareagował na Twój wpis'];
  isAuthenticated: boolean;
  loggedUserSubscription: Subscription;
  notificationSubscription: Subscription;


  constructor(
    private dialog: MatDialog, 
    private router: Router,
    private authService: AuthService,
    private baseService: BaseService
    ) {}

  ngOnInit() {
    this.baseService.getUserNotifications();
    this.loggedUserSubscription = this.authService.user.subscribe( user => {
      this.isAuthenticated = !!user;
    });
    this.notificationSubscription = this.baseService.newNotifications.subscribe( x => {
      this.notifications = x;
      this.newNotificationsNumber = this.notifications.filter(x => x.isReaded == false).length;
    });
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
    return true;
  }

   logout() {
     this.authService.logout().subscribe( resData => {
       console.log(resData)
     });
    }

}
