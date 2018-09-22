import { Injectable } from '@angular/core';
import { AnimationMixer, AxesHelper, FBXLoader, Group, Mesh, Vector3 } from 'three';

import fbxLoader from '@libs/FBXloader';

import { HeightMapOptions } from './engine.types';

import { HeightMapService } from './core/3d-helpers/height-map.service';
import { BehaviorSubject } from 'rxjs';
import { SceneService } from './core/base/scene.service';
import { CameraService } from './core/base/camera.service';
import { SettingsService } from '@services/settings.service';
import { StorageService } from '@services/storage.service';

//TODO: избавиться с помощью сторейджев

@Injectable()
export class EngineService {
  private _x = 0;
  private _y = 0;
  private _z = 0;

  get x() {
    return this._x;
  }

  set x(value) {
    this._x = value;
  }

  get y() {
    return this._y;
  }

  set y(value) {
    this._y = value;
  }

  get z() {
    return this._z;
  }

  set z(value) {
    this._z = value;
  }

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

  public init() {
    // Scene
    // let d = this.settings.camera.d;

    let axesHelper = new AxesHelper(5);

    // Delete
    // this.test();
    // End Delete

    this.sceneService.scene.add(axesHelper);

    // console.log(this.sceneService.scene);

    this.cameraService.domElement = this.sceneService.renderer.domElement;

    this.updateCamera();
  }

  //TODO: вынести
  public updateCamera(x?, y?, z?) {
    // console.log(this.x);

    if (x) {
      this.x = this.x + x;
    }
    if (y) {
      this.y = this.y + y;
    }
    if (z) {
      this.z = this.z + z;
    }
    // this.y = this.y + y;
    // this.z = this.z + z;
    // console.log(this.x);

    let camera = this.cameraService.updateCamera(new Vector3(this.x, this.y, this.z));
    this.sceneService.camera = camera;
  }

  //TODO: вынести
  public map(img) {
    let options: HeightMapOptions = {
      grid: false
    };

    console.log(this.sceneService.scene);

    this.heightMapService.changeMapFromImage(options, this.sceneService.scene, img);
  }

  public generateFromNoise() {
    this.heightMapService.generateDungeonTerrain(this.sceneService.scene);
    // this.heightMapService.getHeightMap(this.sceneService.scene);
  }

  public generateFromNoise2() {
    this.heightMapService.generateDungeonTerrain2(this.sceneService.scene);
    // this.heightMapService.getHeightMap(this.sceneService.scene);
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
