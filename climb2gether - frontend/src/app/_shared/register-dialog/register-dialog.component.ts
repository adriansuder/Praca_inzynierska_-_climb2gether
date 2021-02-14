import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/_models/user';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';

@Component({
  selector: 'app-register-dialog',
  templateUrl: './register-dialog.component.html',
  styleUrls: ['./register-dialog.component.scss']
})
export class RegisterDialogComponent implements OnInit {
  registerForm: FormGroup;
  hide = true;
  selectedRoleName: string = '';
  secretCode: string;

  UserRoles: { roleId: number, RoleName: string, isAdmin: boolean }[] = [];

  constructor(
    private auth: AuthService,
    private router: Router,
    private dialogRef: MatDialogRef<LoginDialogComponent>) { }

  async ngOnInit() {
    this.registerForm = new FormGroup({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required]),
      sex: new FormControl('', [Validators.required]),
      surname: new FormControl('', [Validators.required]),
      roleId: new FormControl('', [Validators.required]),
      dateOfBirth: new FormControl('', [Validators.required]),
      phoneNumber: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      secretCode: new FormControl('')
    });
    await this.getRoles();
    
  }

  async register() {
    var newUser: User = {
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      name: this.registerForm.value.name,
      username: this.registerForm.value.username,
      sex: this.registerForm.value.sex,
      surname: this.registerForm.value.surname,
      roleId: +this.registerForm.value.roleId,
      dateOfBirth: this.registerForm.value.dateOfBirth,
      phoneNumber: this.registerForm.value.phoneNumber,
      city: this.registerForm.value.city
    }
    const secretCode = this.registerForm.value.secretCode
    const result = await this.auth.register(newUser, (!secretCode ? null : secretCode ));
    console.log(result);
    if(result){
      this.router.navigate(['/dashboard/posts']);
          this.dialogRef.close();
    }
  }

  async getRoles() {
    this.UserRoles = await this.auth.getUserRoles();
  }

  logout() {
    this.auth.logout().subscribe(res => {
      console.log(res);
    });
  }

  changeRole(value){
    switch(value) { 
      case 1: { 
         this.selectedRoleName = 'Administrator' 
         break; 
      } 
      case 2: { 
        this.selectedRoleName = 'Instruktor' 
         break; 
      } 
      case 3: { 
        this.selectedRoleName = 'Wspinacz'
        break; 
     } 
     case 4: { 
      this.selectedRoleName = 'Turysta' 
      break; 
   } 
   }
  }
}
