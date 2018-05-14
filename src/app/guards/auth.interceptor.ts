import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import {LoginService} from "../modules/ui-interfaces/login/login.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private loginService: LoginService
  ) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.loginService.isLoggedIn()){

      request = request.clone({
        setHeaders: {
          Authorization: `JWT ${this.loginService.isLoggedIn()}`
        }
      });

    }

    return next.handle(request);
  }
}
