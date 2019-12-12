import { Injectable } from '@angular/core';
import { AxesHelper, Vector3 } from 'three';

import { HeightMapOptions } from './engine.types';

import { HeightMapService } from './core/3d-helpers/height-map.service';
import { BehaviorSubject } from 'rxjs';
import { SceneService } from './core/base/scene.service';
import { CameraService } from './core/base/camera.service';
import { SettingsService } from '@services/settings.service';

//TODO: избавиться с помощью сторейджев

@Injectable()
export class EngineService {

  get settingsService(): SettingsService {
    return this._settingsService;
  }

  set settingsService(value: SettingsService) {
    this._settingsService = value;
  }

  get heightMapService(): HeightMapService {
    return this._heightMapService;
  }

  set heightMapService(value: HeightMapService) {
    this._heightMapService = value;
  }

  get cameraService(): CameraService {
    return this._cameraService;
  }

  set cameraService(value: CameraService) {
    this._cameraService = value;
  }

  get sceneService(): SceneService {
    return this._sceneService;
  }

  set sceneService(value: SceneService) {
    this._sceneService = value;
  }

  constructor(
    private _heightMapService: HeightMapService,
    private _sceneService: SceneService,
    private _cameraService: CameraService,
    private _settingsService: SettingsService
  ) {
    //this.settingsService.settings$.subscribe(data => {
    // console.log(data);
    //this.cameraService.initIsometricCamera();
    //});
  }

  private _initStatus: any = new BehaviorSubject<any>(null);
  public _initStatus$ = this._initStatus.asObservable();

  public get initStatus() {
    return this._initStatus;
  }

  public set initStatus(value: any) {
    this._initStatus.next(value);
  }

  public init(width, height) {
    // Scene
    // let d = this.settings.camera.d;

    let axesHelper = new AxesHelper(5);

    // Delete
    // this.test();
    // End Delete

    this.sceneService.init(width, height);
    this.sceneService.scene.add(axesHelper);

    // console.log(this.sceneService.scene);

    this.cameraService.domElement = this.sceneService.renderer.domElement;

    this.updateCamera();
  }

  //TODO: вынести
  public updateCamera() {
    // console.log(this.x);

    // if (x) {
    //   this.x = this.x + x;
    // }
    // if (y) {
    //   this.y = this.y + y;
    // }
    // if (z) {
    //   this.z = this.z + z;
    // }
    // this.y = this.y + y;
    // this.z = this.z + z;
    // console.log(this.x);

    this.cameraService.updateCamera();

    this.sceneService.camera = this.cameraService.cameries[this.settingsService.settings.camera.type];
  }

  //TODO: вынести
  public colorMap(img) {
    let options: HeightMapOptions = {
      grid: false
    };

    console.log(this.sceneService.scene);

    this.heightMapService.changeColorMapFromImage(options, this.sceneService.scene, img);
  }
}
