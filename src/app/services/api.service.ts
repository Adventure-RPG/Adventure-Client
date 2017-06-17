import {HTTP_Response} from "./api.types";

import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable} from 'rxjs/Rx';


import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class ApiService {

  constructor (private http: Http) {}

  private config = {
    "apiUrl":"http://194.58.122.189/"
  };

  private httpUrl = this.config.apiUrl;

  getReq (url:string){
    console.log(this.config)
    return this.http
      .get(this.httpUrl + '/' + url)
      .map((res:Response) => res.json())
      .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }

  postReq (url:string, body: Object) {
    let bodyString = JSON.stringify(body);
    let headers      = new Headers({ 'Content-Type': 'application/json' });
    let options      = new RequestOptions({ headers: headers });

    return this.http.post(`${this.httpUrl}${url}`, body, options)
      .map((res:Response) => res.json())
      .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }

  updateReq (body: Object, url:string) {
    let bodyString = JSON.stringify(body); // Stringify payload
    let headers      = new Headers({ 'Content-Type': 'application/json' });
    let options      = new RequestOptions({ headers: headers });

    return this.http.put(`${this.httpUrl + '/' + url}${body['id']}`, body, options)
      .map((res:Response) => res.json())
      .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }

  deleteReq (id:string) {
    return this.http.delete(`${this.httpUrl}/${id}`)
      .map((res:Response) => res.json())
      .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }

}
