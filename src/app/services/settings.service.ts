import { Injectable, OnInit } from '@angular/core';
import { CAMERA } from '../enums/settings.enum';
import { BehaviorSubject, Observable } from 'rxjs';

import * as Lodash from 'lodash';

export interface Settings {
  browser: Browser;
  camera: Camera;
}
export interface Browser {
  aspectRatio: number;
}
export interface Camera {
  type: CAMERA;
  d: number;
}

@Injectable()
export class SettingsService implements OnInit {
  constructor() {}

  private baseSetting: Settings = {
    browser: {
      aspectRatio: window.innerWidth / window.innerHeight
    },
    camera: {
      type: CAMERA.IsometricCamera,
      d: 20
    }
  };

  private _settings: BehaviorSubject<Settings> = new BehaviorSubject(
    JSON.parse(localStorage.getItem('settings')) || this.baseSetting
  );

  public settings$: Observable<Settings> = this._settings.asObservable();

  get settings(): Settings {
    return this._settings.getValue();
  }

  set settings(value) {
    this._settings.next(value);
    localStorage.setItem('settings', JSON.stringify(value));
  }

  changeSetting(key, value) {
    let obj = {};
    obj[key] = value;
    let mergeModel = Lodash.merge(this._settings.getValue(), obj);
    this.settings = mergeModel;
  }

  ngOnInit(): void {
    this.settings = JSON.parse(localStorage.getItem('settings'));
  }
}
