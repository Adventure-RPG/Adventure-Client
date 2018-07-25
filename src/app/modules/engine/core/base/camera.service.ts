import { Injectable, OnInit } from '@angular/core';
import { Camera, CubeCamera, OrthographicCamera, PerspectiveCamera } from 'three';
import { SettingsService } from '../../../../services/settings.service';
import * as Lodash from 'lodash';
import { CAMERA } from '../../../../enums/settings.enum';
import {FirstPersonControls} from 'app/utils/first-person-controls';

@Injectable()
export class CameraService implements OnInit {
  private _camera: Camera | OrthographicCamera | CubeCamera;
  private _cameries: { [key: string]: Camera | OrthographicCamera | CubeCamera };
  private _domElement;
  constructor(private settingsService: SettingsService) {}
//, private _domElement: domElement
  get camera(): Camera | OrthographicCamera | CubeCamera {
    return this._camera;
  }

  set camera(value: Camera | OrthographicCamera | CubeCamera) {
    this._camera = value;
  }

  get cameries(): { [p: string]: Camera | OrthographicCamera | CubeCamera } {
    return this._cameries;
  }

  set cameries(value: { [p: string]: Camera | OrthographicCamera | CubeCamera }) {
    this._cameries = value;
  }

  get domElement()
  {
    return this._domElement;
  }

  set domElement(value)
  {
    this._domElement = value;
  }

  x;
  y;
  z;

  public updateCamera(position, x?, y?, z?) {
    // console.log(this.settingsService.settings.camera.type);
    // console.log(CAMERA.IsometricCamera);

    if (!x) {
      x = 0;
    }
    if (!y) {
      y = 0;
    }
    if (!z) {
      z = 0;
    }

    // TODO: дописать апдейт к камере.

    // console.log(x, y);

    console.log(this.camera);

    if (!this.camera) {
      this.initIsometricCamera();
      this.init2dCamera();
      this.initFirstPersonCamera();
    } else {
      if (this.settingsService.settings.camera.type === CAMERA.IsometricCamera) {
        this.updateIsometricCamera();
      } else if (this.settingsService.settings.camera.type === CAMERA.MapCamera) {
        this.update2dCamera();
      }
      else if (this.settingsService.settings.camera.type === CAMERA.FirstPersonCamera){
        this.updateFirstPersonCamera();
      }
    }

    console.log("out");

    this.camera.lookAt(position); // or the origin

    return this.camera;
  }

  public initFirstPersonCamera() {
    let d = this.settingsService.settings.camera.d;
    this.camera = new PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 20000);
    this.camera.position.set(d * 8, d * 8, d * 8);
    this.camera.rotation.y = - 135 * Math.PI / 180;
    // require('three-first-person-controls')(THREE);
    //
    // console.log(FPC);

    let controls = new FirstPersonControls( this.camera, this.domElement );
    console.log(controls);
    console.log("here");
    //
    // controls.movementSpeed = 1000;
    // controls.lookSpeed = 0.125;
    // controls.lookVertical = true;
    // controls.constrainVertical = true;
    // controls.verticalMin = 1.1;
    // controls.verticalMax = 2.2;

    let obj = {};
    obj[CAMERA.FirstPersonCamera] = this.camera;
    let mergeModel = Lodash.merge(this.cameries, obj);
    this.cameries = mergeModel;
  }

  public updateFirstPersonCamera() {
    let d = this.settingsService.settings.camera.d;
    this.camera = this.cameries[CAMERA.FirstPersonCamera];
    this.camera.position.set(d * 8, d * 8, d * 8);
  }

  public initIsometricCamera() {
    let d = this.settingsService.settings.camera.d;

    //Остановился на добавление второго типа камеры и переключателя для камер.

    this.camera = new OrthographicCamera(
      -d * this.settingsService.settings.browser.aspectRatio,
      d * this.settingsService.settings.browser.aspectRatio,
      d,
      -d,
      1,
      d * 40
    );

    this.camera.position.set(d * 8, d * 8, d * 8); // all components equal
    let obj = {};
    obj[CAMERA.IsometricCamera] = this.camera;
    let mergeModel = Lodash.merge(this.cameries, obj);
    this.cameries = mergeModel;
  }

  public updateIsometricCamera(x?, y?, z?) {
    let d = this.settingsService.settings.camera.d;
    this.camera = this.cameries[CAMERA.IsometricCamera];

    // console.log(x, y, z);

    (<OrthographicCamera>this.camera).left = -d * this.settingsService.settings.browser.aspectRatio;
    (<OrthographicCamera>this.camera).right = -d * this.settingsService.settings.browser.aspectRatio;
    (<OrthographicCamera>this.camera).top = d;
    (<OrthographicCamera>this.camera).bottom = -d;
    (<OrthographicCamera>this.camera).near = 1;
    (<OrthographicCamera>this.camera).far = d * 40;

    this.camera.position.set(d * 8, d * 8, d * 8);
  }

  public init2dCamera() {
    let d = this.settingsService.settings.camera.d;
    this.camera = this.cameries[CAMERA.MapCamera];
    this.camera = new CubeCamera(1, d * 40, 128);
    this.camera.position.set(0, d * 4, 0); // all components equal

    let obj = {};
    obj[CAMERA.MapCamera] = this.camera;
    let mergeModel = Lodash.merge(this.cameries, obj);
    this.cameries = mergeModel;
  }

  public update2dCamera() {
    let d = this.settingsService.settings.camera.d;
    this.camera.position.set(0, d * 4, 0); // all components equal
  }

  ngOnInit(): void {}
}
