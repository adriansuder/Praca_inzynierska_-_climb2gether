import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../services/users.service';
import { PrivateUserInfo } from '../_models/PrivateUserInfo';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit {
  hide = true;
  url;
  user: PrivateUserInfo;
  userForm: FormGroup;
  constructor(
    private usersService: UsersService
  ) { }

  async ngOnInit() {
    this.user = await this.usersService.getPrivateUserInfo();
    this.userForm = new FormGroup({
      Username: new FormControl({value: this.user.username, disabled: true}, [Validators.required]),
      Email: new FormControl({value: this.user.email, disabled: true}, [Validators.required]),
      FirstName: new FormControl({value: this.user.firstName, disabled: true}, [Validators.required]), 
      Surname: new FormControl(this.user.surname, [Validators.required]), 
      Sex: new FormControl({value: this.user.sex, disabled: true}, [Validators.required]),
      RoleName: new FormControl({value: this.user.roleName, disabled: true}, [Validators.required]), 
      DateOfBirth: new FormControl({value: this.user.dateOfBirth, disabled: true}, [Validators.required]),
      Phone: new FormControl(this.user.phone, [Validators.required]),
      City: new FormControl(this.user.city, [Validators.required]),
      File: new FormControl(''),
      Password1: new FormControl(''),
      Password2: new FormControl('')
    });
  }

  onSubmit(){

  }

  delete(){
    this.url = null;
  }

}
