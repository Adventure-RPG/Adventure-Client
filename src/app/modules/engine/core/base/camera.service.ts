import { Injectable, OnInit } from '@angular/core';
import { Camera, CubeCamera, OrthographicCamera, PerspectiveCamera } from 'three';
import { SettingsService } from '../../../../services/settings.service';
import * as Lodash from 'lodash';
import { CAMERA } from '../../../../enums/settings.enum';
import { FirstPersonControls } from 'app/utils/first-person-controls';
import { StorageService } from '../../../../services/storage.service';
import { Types } from '@enums/types.enum';
import { OrthographicCameraControls } from '../../../../utils/orthographic-camera-controls';

//import { OrthographicCameraControls } from '../../../../utils/orthographic-camera-controls';

@Injectable()
export class CameraService implements OnInit {
  private _camera: Camera | OrthographicCamera | CubeCamera | PerspectiveCamera;
  private _cameries: {
    [key: string]: Camera | OrthographicCamera | CubeCamera | PerspectiveCamera;
  };
  private _domElement;

  x;
  y;
  z;

  constructor(private settingsService: SettingsService, private storageService: StorageService) {}

  get camera(): Camera | OrthographicCamera | CubeCamera | PerspectiveCamera {
    return this._camera;
  }

  set camera(value: Camera | OrthographicCamera | CubeCamera | PerspectiveCamera) {
    this._camera = value;
  }

  get cameries(): { [p: string]: Camera | OrthographicCamera | CubeCamera | PerspectiveCamera } {
    return this._cameries;
  }

  set cameries(value: {
    [p: string]: Camera | OrthographicCamera | CubeCamera | PerspectiveCamera;
  }) {
    this._cameries = value;
  }

  get domElement() {
    return this._domElement;
  }

  set domElement(value) {
    this._domElement = value;
  }

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

    // console.log(this.camera);

    if (!this.camera) {
      this.initIsometricCamera();
      this.init2dCamera();
      this.initFirstPersonCamera();
    } else {
      if (this.settingsService.settings.camera.type === CAMERA.IsometricCamera) {
        // console.log(this.settingsService.settings.camera.type);
        this.updateIsometricCamera();
      } else if (this.settingsService.settings.camera.type === CAMERA.MapCamera) {
        this.update2dCamera();
      } else if (this.settingsService.settings.camera.type === CAMERA.FirstPersonCamera) {
        this.updateFirstPersonCamera();
      }
    }

    return this.camera;
  }

  public initFirstPersonCamera() {
    let d = this.settingsService.settings.camera.d;
    this.camera = new PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 20000);
    this.camera.position.set(d * 8, d * 8, d * 8);
    this.camera.rotation.y = (-135 * Math.PI) / 180;
    // require('three-first-person-controls')(THREE);
    //
    // console.log(FPC);

    let controls = new FirstPersonControls(this.camera, this.domElement, this.storageService);
    // console.log(this.camera, this.domElement, this.storageService);

    let obj = {};
    // controls.update();
    obj[CAMERA.FirstPersonCamera] = this.camera;
    let mergeModel = Lodash.merge(this.cameries, obj);
    this.cameries = mergeModel;
  }

  public updateFirstPersonCamera() {
    this.commandsCleanUp();
    this.camera = this.cameries[CAMERA.FirstPersonCamera];
    let controls = new FirstPersonControls(this.camera, this.domElement, this.storageService);
  }

  public initIsometricCamera() {
    let d = this.settingsService.settings.camera.d;

    //Остановился на добавление второго типа камеры и переключателя для камер.
    // console.log(d);

    this.camera = new OrthographicCamera(
      -d * this.settingsService.settings.browser.aspectRatio,
      d * this.settingsService.settings.browser.aspectRatio,
      d,
      -d,
      1,
      d * 40
    );
    this.camera.position.set(0, 0, 100);
    let controls = new OrthographicCameraControls(
      this.camera,
      this.domElement,
      this.storageService
    );

    controls.movementSpeed = 1000;
    controls.lookSpeed = 0.125;
    controls.lookVertical = true;
    controls.constrainVertical = true;
    controls.verticalMin = 1.1;
    controls.verticalMax = 2.2;

    let obj = {};
    obj[CAMERA.IsometricCamera] = this.camera;
    let mergeModel = Lodash.merge(this.cameries, obj);
    this.cameries = mergeModel;
  }

  public updateIsometricCamera(x?, y?, z?) {
    this.commandsCleanUp();
    this.camera = this.cameries[CAMERA.IsometricCamera];
    let controls = new OrthographicCameraControls(
      this.camera,
      this.domElement,
      this.storageService
    );
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

  public commandsCleanUp() {
    this.storageService.hotkeySceneCommandDelete(Types.Camera);
    this.storageService.rendererStorageCommandDelete(Types.Camera);
  }

  ngOnInit(): void {}
}
