import { Injectable } from '@angular/core';

@Injectable()
export class SettingsService {

  constructor() { }

  private _browser = {
    aspectRatio: window.innerWidth / window.innerHeight
  };

  get browser(): { aspectRatio: number } {
    return this._browser;
  }

  set browser(value: { aspectRatio: number }) {
    this._browser = value;
  }

  private _camera = {
    d: 20,
  };

  get camera(): { d: number } {
    return this._camera;
  }

  set camera(value: { d: number }) {
    this._camera = value;
  }


}
