import {HTTP_Response} from "./api.types";

import { Injectable } from '@angular/core';
import { Observable} from 'rxjs/Rx';


import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {catchError} from "rxjs/operators";
import {ErrorObservable} from "rxjs/observable/ErrorObservable";
import {AppService} from "../app.service";
import {HandleErrorService} from "./handle-error.service";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ApiService {
  constructor (
    private httpClient: HttpClient,
    private appService: AppService,
    private handleErrorService: HandleErrorService
  ) {
    console.log('set')
  }


  private config = {
    "apiUrl":"http://194.58.122.189/"
  };

  private httpUrl = this.config.apiUrl;

  get (url:string, options?){
    console.log(this.config)
    return this.httpClient
      .get(url, httpOptions || options)
      .pipe(
        catchError(this.handleErrorService.handleError.bind(this))
      )
      .do((res:Response) => res.json());
  }

  post (url:string, body: Object, options?) {
    console.log(this.config)
    return this.httpClient
      .post(url, body, httpOptions || options)
      .pipe(
        catchError(this.handleErrorService.handleError.bind(this.handleErrorService))
      );
  }

  put (url:string, body: Object, options?) {
    return this.httpClient
      .put(url, body, options)
      .pipe(
        catchError(this.handleErrorService.handleError.bind(this.handleErrorService))
      )
      .do((res:Response) => res.json());
  }

  delete (url: string, options?) {
    return this.httpClient
      .delete(url, options)
      .pipe(
        catchError(this.handleErrorService.handleError.bind(this.handleErrorService))
      )
      .do((res:Response) => res.json());
  }

}
