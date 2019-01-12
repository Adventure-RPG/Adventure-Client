import { catchError, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import {HttpClient, HttpEvent, HttpHeaders} from '@angular/common/http';
import { AppService } from '../app.service';
import { HandleErrorService } from './handle-error.service';
import {Observable} from "rxjs/index";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ApiService {
  constructor(
    private httpClient: HttpClient,
    private appService: AppService,
    private handleErrorService: HandleErrorService
  ) {
    console.log('set');
  }

  private config = {
    apiUrl: 'http://194.58.122.189/'
  };

  private httpUrl = this.config.apiUrl;

  get(url: string, options?) {
    console.log(this.config);
    return this.httpClient
      .get(url, httpOptions || options)
      .pipe(catchError(this.handleErrorService.handleError.bind(this)))
      .pipe(tap((res: Response) => res.json()));
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
      .pipe(
        tap((res: HttpEvent<T>) => res.json()),
        catchError(this.handleErrorService.handleError.bind(this.handleErrorService))
      );
  }

  delete<T>(url: string, options?) {
    return this.httpClient
      .delete<T>(url, options)
      .pipe(
        tap((res: HttpEvent<T>) => res.json()),
        catchError(this.handleErrorService.handleError.bind(this.handleErrorService))
      );
  }
}
