import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthService } from '../../_services/auth.service';
import { User } from 'src/app/_models/user';
import { MatDialogRef } from '@angular/material/dialog';



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

  get f() { return this.loginForm.controls;  }

  login() {
    this.auth.login(
      {
        username: this.f.username.value,
        password: this.f.password.value
      }
    )
    .subscribe(success => {
      if (success) {
        this.router.navigate(['/dashboard']);
        this.dialogRef.close();
      }
    });
  }

}



