import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { LoginService } from '../modules/ui-interfaces/login/login.service';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private loginService: LoginService, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.loginService.isLoggedIn()) {
      this.router.navigate(['/login/']);
      return false;
    }

    return true;
  }
  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return true;
    // return this.loginService.isLoggedIn().take(1);
  }
}
