import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';
import { RegisterDialogComponent } from '../register-dialog/register-dialog.component';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';
import { BaseService } from 'src/app/services/base.service';
import { Notification } from 'src/app/_models/Notification';
import { ChatService } from 'src/app/services/chat.service';



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
  unreadedConversations: number = 0;


  constructor(
    private dialog: MatDialog,
    private router: Router,
    private authService: AuthService,
    private baseService: BaseService,
    private chatService: ChatService
    ) {}

  ngOnInit() {
    this.loggedUserSubscription = this.authService.user.subscribe( user => {
      this.isAuthenticated = !!user;
    });
    this.notificationSubscription = this.baseService.newNotifications.subscribe( x => {
      this.notifications = x;
      if(this.notifications){
        this.newNotificationsNumber = this.notifications.filter( x => x.isReaded === false).length;
      }
      console.log(this.notifications)
    });
    this.baseService.getUserNotifications();
    this.chatService.fetchConversations();
    this.chatService.countOfUnreadedMessages.subscribe(res => {
      this.unreadedConversations = res;
    })

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
    if(!this.authService.loggedUser){
      return false;
    };
    return true;
  }

   logout() {
     this.authService.logout().subscribe( resData => {
       console.log(resData)
     });
    }

    async onSetNotificationsReaded(){
      let unreadedMessages = this.notifications.filter(x => x.isReaded == false);
      if(unreadedMessages.length <= 0){
        return;
      }

      let result = await this.baseService.setNotificationsReaded();

      if(!result){
        return;
      }
      unreadedMessages.forEach(x => {
        x.isReaded = true;
      })
      this.newNotificationsNumber = 0;
    }

}
