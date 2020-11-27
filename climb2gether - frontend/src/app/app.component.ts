import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { SwPush, SwUpdate } from '@angular/service-worker';
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
    private update: SwUpdate,
    private push: SwPush
    ){}

  ngOnInit(){
    this.authService.automaticLogin();
    this.update.available.subscribe( updates => {
      console.log('new updates!!!')
    })
  }
}
