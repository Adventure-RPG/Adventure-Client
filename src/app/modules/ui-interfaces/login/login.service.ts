import { Injectable } from '@angular/core';
import {ApiService} from "../../../services/api.service";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {LoginReq, LoginResponse, RegistrateReq} from "./login";
import {SnotifyService} from "ng-snotify";

@Injectable()
export class LoginService {

  constructor(
    private apiService: ApiService
  ) {}

  public authUrl = 'http://auth.iamborsch.ru/';

  private _registrate:any = new BehaviorSubject<any>({});
  public _registrate$ = this._registrate.asObservable();

  public get registrate() {
      return this._registrate;
  }

  public set registrate(value: any){
      this._registrate.next(value);
  }

  public httpRegistrate(body:RegistrateReq): any{
    return this.apiService
      .post(this.authUrl + 'api/v1/auth/register', body);
  }

  private _signIn:any = new BehaviorSubject<any>({});
  public _signIn$ = this._signIn.asObservable();

  public get signIn() {
      return this._signIn;
  }

  public set signIn(value: any){
      this._signIn.next(value);
  }

  public httpSignIn(body:RegistrateReq): any{
    this.apiService
    .post(this.authUrl + 'api/v1/auth/login', body)
    .subscribe(
      (res:LoginResponse) =>{
        console.log(res)
      },
      error =>  {
        console.log(error);
      }
    );
  }

  private _recovery:any = new BehaviorSubject<any>({});
  public _recovery$ = this._recovery.asObservable();

  public get recovery() {
      return this._recovery;
  }

  public set recovery(value: any){
      this._recovery.next(value);
  }

  public httpRecovery(body): any{
    this.apiService
    .post('users', body)
    .subscribe(
      data  => {
        console.log(data);
      },
      error =>  {
        console.log(error);
      }
    );
  }



}
