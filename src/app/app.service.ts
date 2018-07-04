import { Injectable } from '@angular/core';

/**
 * Mud hack for root services
 */

@Injectable()
export class AppService {
  get snotifyService() {
    return this._snotifyService;
  }

  set snotifyService(value) {
    console.log(value);
    this._snotifyService = value;
  }

  private _snotifyService;

  constructor() {}
}
