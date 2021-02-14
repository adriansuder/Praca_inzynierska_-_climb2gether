import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UsersService } from '../services/users.service';
import { PublicUserInfo } from '../_models/PublicUserInfo';

@Component({
  selector: 'app-user-public-profiles',
  templateUrl: './user-public-profiles.component.html',
  styleUrls: ['./user-public-profiles.component.scss']
})
export class UserPublicProfilesComponent implements OnInit, OnDestroy {

  users: PublicUserInfo[] ;
  usersChangedSubscription: Subscription;
  constructor(
    private usersService: UsersService,
    private router: Router
  ) { }

  openUserDetails(userId: number): void{
    this.router.navigate([`profiles/${userId}/details`]);
  }

  ngOnInit(): void {
    this.users = this.usersService.searchResultList;
    this.usersChangedSubscription = this.usersService.usersSearchResultChanged.subscribe( res => {
      this.users = res;
    });
  }

  // openUserDetails(userId: number){
  //   this.router.navigate([`profiles/${userId}/details`]);
  // }

  ngOnDestroy(){
    this.usersChangedSubscription.unsubscribe();
  }

}
