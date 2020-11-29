import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';

@Component({
  selector: 'app-register-dialog',
  templateUrl: './register-dialog.component.html',
  styleUrls: ['./register-dialog.component.scss']
})
export class RegisterDialogComponent implements OnInit {
  registerForm: FormGroup;
  hide = true;

  UserRoles : { Id: number, RoleName: string, isAdmin: boolean }[] = [];

  constructor(
    private auth: AuthService, 
    private formBuilder: FormBuilder, 
    private router: Router,
    private dialogRef: MatDialogRef<LoginDialogComponent>) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      email: [''],
      password: [''],
      name: [''],
      username: [''],
      sex: [''],
      surname: [''],
      roleId: [''],
      dateOfBirth: [''],
      phoneNumber: [''],
      city: ['']
    });

    this.getRoles();

  }

  get f() { return this.registerForm.controls;  }


  register() {
    console.log(this.UserRoles);
    this.auth.register(
      { 
        email: this.f.email.value,
        password: this.f.password.value,
        name: this.f.name.value,
        username: this.f.username.value,
        sex: this.f.sex.value,
        surname: this.f.surname.value,
        roleId: +this.f.roleId.value,
        dateOfBirth: this.f.dateOfBirth.value,
        phoneNumber: this.f.phoneNumber.value,
        city: this.f.city.value
      }
    )
    .subscribe(success => {
      if (success) {
        this.router.navigate(['/dashboard']);
        this.dialogRef.close();
      }
    });
  }

   async getRoles(){
    this.UserRoles = await this.auth.getUserRoles();
    console.log(this.UserRoles);
  }

  logout() {
    this.auth.logout().subscribe( res => {
      console.log(res);
    });

  }

}
