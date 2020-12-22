import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { MatDialogRef } from '@angular/material/dialog';
import { BaseService } from 'src/app/services/base.service';



@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent implements OnInit {
  loginForm: FormGroup;
  hide = false;

  constructor(
    private auth: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private dialogRef: MatDialogRef<LoginDialogComponent>
  ) { }
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: [''],
      password: ['']
    });
  }

  get f() { return this.loginForm.controls; }

  async login() {
    const login = await this.auth.login(
      {
        username: this.f.username.value,
        password: this.f.password.value
      }
    )
    if (login) {
      this.router.navigate(['/dashboard/posts']);
      this.dialogRef.close();
    }
  }

}




