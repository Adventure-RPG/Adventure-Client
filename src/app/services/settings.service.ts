import { Injectable } from '@angular/core';

@Injectable()
export class SettingsService {

  constructor() { }

  private _camera = {
    d: 20
  };


  get camera(): { d: number } {
    return this._camera;
  }

  set camera(value: { d: number }) {
    this._camera = value;
  }
}
