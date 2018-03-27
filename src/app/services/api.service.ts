import {HTTP_Response} from "./api.types";

import { Injectable } from '@angular/core';
import { Observable} from 'rxjs/Rx';


import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {catchError} from "rxjs/operators";
import {ErrorObservable} from "rxjs/observable/ErrorObservable";
import {AppService} from "../app.service";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ApiService {
  get snotifyService() {
    console.log(this._snotifyService);
    return this._snotifyService;
  }

  set snotifyService(value) {
    console.log(value);
    this._snotifyService = value;
  }

  constructor (
    private httpClient: HttpClient,
    private appService: AppService
  ) {
    console.log('set')
  }

  private _snotifyService;

  private config = {
    "apiUrl":"http://194.58.122.189/"
  };

  private httpUrl = this.config.apiUrl;

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      console.log(error);
      console.log(error.message);
      console.log(error.error);
      console.log(this.snotifyService);
      this.snotifyService.error(error.message);
    }
    // return an ErrorObservable with a user-facing error message
    return new ErrorObservable(
      'Something bad happened; please try again later.');
  };

  get (url:string, options?){
    console.log(this.config)
    return this.httpClient
      .get(url, httpOptions || options)
      .pipe(
        catchError(this.handleError.bind(this))
      )
      .do((res:Response) => res.json());
  }

  post (url:string, body: Object, options?) {
    console.log(this.config)
    return this.httpClient
      .post(url, body, httpOptions || options)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  put (url:string, body: Object, options?) {
    return this.httpClient
      .put(url, body, options)
      .pipe(
        catchError(this.handleError.bind(this))
      )
      .do((res:Response) => res.json());
  }

  delete (url: string, options?) {
    return this.httpClient
      .delete(url, options)
      .pipe(
        catchError(this.handleError.bind(this))
      )
      .do((res:Response) => res.json());
  }

}
