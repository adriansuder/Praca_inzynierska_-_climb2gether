import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { NgxImageCompressService } from 'ngx-image-compress';
import { BaseService } from '../services/base.service';
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
  userPhotoChanged: boolean = false;
  userForm: FormGroup;
  regex: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,}$/;
  changePassword: boolean = false;
  requiredValidator = [
    Validators.required,
    Validators.pattern(this.regex)
  ];
  constructor(
    private usersService: UsersService,
    private baseService: BaseService,
    private imageCompress: NgxImageCompressService
  ) { }


  passwordValidator(group: FormGroup) {
    let pass = group.get('Password1').value;
    let confirmPass = group.get('Password2').value;
    if(pass !== confirmPass){
      group.get('Password2').setErrors({notSame: true})
    }
    return pass === confirmPass ? null : { notSame: true }   
  }

  async ngOnInit() {
    
    this.user = await this.usersService.getPrivateUserInfo();
    console.log(this.user);
    this.userForm = new FormGroup({
      Username: new FormControl({ value: this.user.username, disabled: true }, [Validators.required]),
      Email: new FormControl({ value: this.user.email, disabled: true }, [Validators.required]),
      FirstName: new FormControl({ value: this.user.firstName, disabled: true }, [Validators.required]),
      Surname: new FormControl({ value: this.user.surname, disabled: true }, [Validators.required]),
      Sex: new FormControl({ value: this.user.sex, disabled: true }, [Validators.required]),
      RoleName: new FormControl({ value: this.user.roleName, disabled: true }, [Validators.required]),
      DateOfBirth: new FormControl({ value: this.user.dateOfBirth.toString().substr(0,10)  , disabled: true }, [Validators.required]),
      Phone: new FormControl(this.user.phone, [Validators.required]),
      City: new FormControl(this.user.city, [Validators.required]),
      File: new FormControl(''),
      OldPassword: new FormControl({ value: '', disabled: true }),
      Password1: new FormControl({ value: '', disabled: true }),
      Password2: new FormControl({ value: '', disabled: true })

    },{validators: this.passwordValidator});

    if(this.user.img){
      this.url = await this.getAttatchment(this.user.img);
    }

  }

  async getAttatchment(id: string) {
    let img: any = await this.baseService.getAttatchment(id);
    return img;
  }

  onChangePassword() {
    this.changePassword = !this.changePassword;
    this.changePassword ? this.userForm.get('OldPassword').enable() : this.userForm.get('OldPassword').disable();
    this.changePassword ? this.userForm.get('Password1').enable() : this.userForm.get('Password1').disable();
    this.changePassword ? this.userForm.get('Password2').enable() : this.userForm.get('Password2').disable();
    this.changePassword ? this.userForm.get('OldPassword').setValidators(this.requiredValidator) : this.userForm.get('OldPassword').clearValidators()
    this.changePassword ? this.userForm.get('Password1').setValidators(this.requiredValidator) : this.userForm.get('Password1').clearValidators()
    this.changePassword ? this.userForm.get('Password2').setValidators(this.requiredValidator) : this.userForm.get('Password2').clearValidators()
    this.userForm.get('OldPassword').updateValueAndValidity();
    this.userForm.get('Password1').updateValueAndValidity();
    this.userForm.get('Password2').updateValueAndValidity();
  }

  async onSubmit() {
    let userPhotoStatus: string;
    if(this.userPhotoChanged && this.url == null){ userPhotoStatus = "delete"}
    else if(this.userPhotoChanged && this.url != null){ userPhotoStatus = "update"}
    let isUpdated;
    if (this.changePassword) {
      isUpdated = await this.usersService.updateUserInfo(
        userPhotoStatus,
        this.userForm.value.Phone,
        this.userForm.value.City,
        this.userForm.value.OldPassword,
        this.userForm.value.Password2,
        (this.userPhotoChanged ? this.url : null)
      )
    } else if (!this.changePassword) {
      isUpdated = await this.usersService.updateUserInfo(
        userPhotoStatus,
        this.userForm.value.Phone,
        this.userForm.value.City,
        null,
        null,
        (this.userPhotoChanged ? this.url : null)
      )
    }
    if (!isUpdated) {
      this.baseService.openSnackBar("Coś poszło nie tak, spróbuj jeszcze raz.")
      return;
    }
    this.baseService.openSnackBar("Twoje dane zostały zapisane.")

  }

  delete() {
    this.url = null;
  }

  deleteUrl(){
    this.url = null;
    this.userPhotoChanged = true;
  }

  private compressFile() {

    this.imageCompress.uploadFile().then(({image}) => {
      this.imageCompress.compressFile(image, 70, 70).then(
        result => {
          this.url = result;
          this.userPhotoChanged = true;
        }
      );
    });
  }

}
