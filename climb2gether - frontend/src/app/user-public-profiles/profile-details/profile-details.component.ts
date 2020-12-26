import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { BaseService } from 'src/app/services/base.service';
import { UsersService } from 'src/app/services/users.service';
import { PrivateUserInfo } from 'src/app/_models/PrivateUserInfo';


@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.scss']
})
export class ProfileDetailsComponent implements OnInit {
  userId: number;
  url;
  user: PrivateUserInfo;
  userForm: FormGroup;
  constructor(
    private route: ActivatedRoute,
    private usersService: UsersService,
    private baseService: BaseService
  ) { }

  async ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.userId = params['userId'];
    });
    if(this.userId){
      this.user = await this.usersService.getUserDetails(this.userId)
      //this.url = user.Img
    }
    this.userForm = new FormGroup({
      Username: new FormControl( this.user.username),
      Email: new FormControl(this.user.email),
      FirstName: new FormControl(this.user.firstName),
      Surname: new FormControl(this.user.surname),
      Sex: new FormControl(this.user.sex),
      RoleName: new FormControl(this.user.roleName),
      DateOfBirth: new FormControl(this.user.dateOfBirth.toString().substr(0,4)),
      Phone: new FormControl(this.user.phone),
      City: new FormControl(this.user.city)
    });
    if(this.user.img){
      this.url = await this.baseService.getAttatchment(this.user.img);
    }
    
  }


}
