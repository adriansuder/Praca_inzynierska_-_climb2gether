import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

@Injectable()
export class AppComponent implements OnInit{
  title = 'climb2gether';

  constructor(
    private authService: AuthService,
    ){}

  ngOnInit(){
    this.authService.automaticLogin();
  }
}
