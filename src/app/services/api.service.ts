import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppService } from '../app.service';
import { HandleErrorService } from './handle-error.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ApiService {
  constructor(
    private httpClient: HttpClient,
    private appService: AppService,
    private handleErrorService: HandleErrorService
  ) {}

  private config = {
    apiUrl: 'http://194.58.122.189/'
  };

  private httpUrl = this.config.apiUrl;

  get(url: string, options?) {
    console.log(this.config);
    return this.httpClient
      .get(url, httpOptions || options)
      .pipe(catchError(this.handleErrorService.handleError.bind(this)));
  }

  post(url: string, body?: Object, options?) {
    console.log(this.config);
    return this.httpClient
      .post(url, body, httpOptions || options)
      .pipe(catchError(this.handleErrorService.handleError.bind(this.handleErrorService)));
  }

  put<T>(url: string, body: Object, options?) {
    return this.httpClient
      .put<T>(url, body, options)
      .pipe(catchError(this.handleErrorService.handleError.bind(this.handleErrorService)));
  }

  delete<T>(url: string, options?) {
    return this.httpClient
      .delete<T>(url, options)
      .pipe(catchError(this.handleErrorService.handleError.bind(this.handleErrorService)));
  }
}
