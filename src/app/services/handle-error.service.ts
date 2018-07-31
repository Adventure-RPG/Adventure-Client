import {Injectable} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {throwError} from "rxjs/index";

@Injectable()
export class HandleErrorService {
  get snotifyService() {
    console.log(this._snotifyService);
    return this._snotifyService;
  }

  set snotifyService(value) {
    console.log(value);
    this._snotifyService = value;
  }

  private _snotifyService;

  constructor() {}

  public handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      console.log(error);
      console.log(error.message);
      console.log(error.error);
      console.log(this.snotifyService);
      this.snotifyService.error(error.error.message, error.error.error);
    }
    // return an ErrorObservable with a user-facing error message
    return throwError ('Something bad happened; please try again later.');
  }
}
