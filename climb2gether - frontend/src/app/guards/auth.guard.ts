import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../_services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {


    constructor(
        private router: Router,
        private authenticationService: AuthService
    ) { }

    canActivate (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      if (!this.authenticationService.isLoggedIn()) {
                // not logged in so redirect to login page with the return url
          this.router.navigate([''], { queryParams: { returnUrl: state.url } });
          return false;
      }
      return true;
  }
  
}
