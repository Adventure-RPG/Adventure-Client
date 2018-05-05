import { Injectable } from '@angular/core';
import {ApiService} from "../../../services/api.service";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {LoginReq, LoginResponse, RegistrateReq} from "./login";
import {SnotifyService} from "ng-snotify";
import 'rxjs/add/operator/do';


@Injectable()
export class LoginService {

  constructor(
    private apiService: ApiService,
    private snotifyService: SnotifyService
  ) {}

  public authUrl = 'http://auth.iamborsch.ru/';
  //TODO: pull out api/v1
  public version = 'api/v1/';
  public module = 'auth/';

  private _registrate: any = new BehaviorSubject<any>({});
  public _registrate$ = this._registrate.asObservable();

  public get registrate() {
      return this._registrate;
  }

  public set registrate(value: any){
      this._registrate.next(value);
  }

  public httpRegistrate(body: RegistrateReq): any{
    return this.apiService
      .post(this.authUrl + this.version + this.module + 'register', body);
  }

  private _signIn: any = new BehaviorSubject<any>({
    token: localStorage.getItem('token')
  });
  public _signIn$ = this._signIn.asObservable();

  public get signIn() {
      return this._signIn;
  }

  public set signIn(value: any){
      this._signIn.next(value);
  }

  public httpSignIn(body: RegistrateReq): any{
    return this.apiService
      .post(this.authUrl + this.version + this.module + 'login', body)
      .do((data) => {
        localStorage.setItem('auth', JSON.stringify(data));
        this.signIn = data;
      });
  }

  private _recovery: any = new BehaviorSubject<any>({});
  public _recovery$ = this._recovery.asObservable();

  public get recovery() {
      return this._recovery;
  }

  public set recovery(value: any){
      this._recovery.next(value);
  }

  public httpRecovery(body): any{
    this.apiService
    .post(this.authUrl + this.version + this.module + 'users', body)
    .subscribe(
      data  => {
        console.log(data);
      },
      error =>  {
        console.log(error);
      }
    );
  }


  private _emailVerification: any = new BehaviorSubject<any>({});
  public _emailVerification$ = this._emailVerification.asObservable();

  public get emailVerification() {
      return this._emailVerification;
  }

  public set emailVerification(value: any){
      this._emailVerification.next(value);
  }

  public httpEmailVerification(body): any{
    return this.apiService
    .post(this.authUrl + this.version + this.module + 'confirm/' + body.token);
  }

  public isLoggedIn(){
    let activeSession = this.signIn.getValue().access_token || localStorage.getItem('auth');
    console.log(activeSession);
    return activeSession ? true : false;
  }


}
