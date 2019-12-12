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
  } = {};
  private _domElement;

  x;
  y;
  z;

  constructor(private settingsService: SettingsService, private storageService: StorageService) {

    this.initIsometricCamera();
    this.init2dCamera();
    this.initFirstPersonCamera();
    console.log(this.cameries)
  }

  //TODO: протестировать, возможны сбои
  get camera(): Camera | OrthographicCamera | CubeCamera | PerspectiveCamera {
    return this.cameries[this.settingsService.settings.camera.type];
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

  public updateCamera() {
    if (this.settingsService.settings.camera.type === CAMERA.IsometricCamera) {
      // console.log(this.settingsService.settings.camera.type);
      console.log('updateIsometricCamera')
      this.updateIsometricCamera();
    } else if (this.settingsService.settings.camera.type === CAMERA.MapCamera) {
      this.update2dCamera();
      console.log('update2dCamera')
    } else if (this.settingsService.settings.camera.type === CAMERA.FirstPersonCamera) {
      this.updateFirstPersonCamera();
      console.log('updateFirstPersonCamera')
    }
  }

  public initIsometricCamera() {
    let d = this.settingsService.settings.camera.d,
        size = 3;


    this.cameries[CAMERA.IsometricCamera] = new OrthographicCamera(
      -d * this.settingsService.settings.browser.aspectRatio * size,
      d * this.settingsService.settings.browser.aspectRatio * size,
      d * size,
      -d * size,
      1,
      1000
    );

    this.cameries[CAMERA.IsometricCamera].position.set( d * 10, d * 10, d * 10 ); // all components equal
    // this.cameries[CAMERA.IsometricCamera].lookAt( 0, 0, 0 ); // or the origin
    this.cameries[CAMERA.IsometricCamera].rotation.order = 'YXZ';
    this.cameries[CAMERA.IsometricCamera].rotation.y = Math.PI / 4;
    this.cameries[CAMERA.IsometricCamera].rotation.x = Math.atan( - 1 / Math.sqrt( 2 ) );
  }

  public init2dCamera() {
    let viewSize = this.settingsService.settings.camera.d * 10;
    let aspectRatio = this.settingsService.settings.browser.aspectRatio;

    let _viewport = {
      viewSize: viewSize,
      aspectRatio: aspectRatio,
      left: (-aspectRatio * viewSize) / 2,
      right: (aspectRatio * viewSize) / 2,
      top: viewSize / 2,
      bottom: -viewSize / 2,
      near: -100,
      far: 100
    };

    this.cameries[CAMERA.MapCamera] = new OrthographicCamera (
      _viewport.left,
      _viewport.right,
      _viewport.top,
      _viewport.bottom,
      _viewport.near,
      _viewport.far
    );

    this.cameries[CAMERA.MapCamera].rotation.x = -Math.PI / 2;
  }

  public initFirstPersonCamera() {
    let d = this.settingsService.settings.camera.d;
    this.cameries[CAMERA.FirstPersonCamera] = new PerspectiveCamera(50, this.settingsService.settings.browser.aspectRatio, 1, 20000);
    this.cameries[CAMERA.FirstPersonCamera].position.set(d * 8, d * 8, d * 8);
    this.cameries[CAMERA.FirstPersonCamera].rotation.y = (-135 * Math.PI) / 180;

    let controls = new FirstPersonControls(this.cameries[CAMERA.FirstPersonCamera], this.domElement, this.storageService);
    // console.log(this.camera, this.domElement, this.storageService);

  }

  public updateIsometricCamera() {
  }

  public update2dCamera() {
  }

  public updateFirstPersonCamera() {
    // this.commandsCleanUp();
    // let controls = new FirstPersonControls(this.cameries[CAMERA.FirstPersonCamera], this.domElement, this.storageService);
  }

  public commandsCleanUp() {
    this.storageService.hotkeySceneCommandDelete(Types.Camera);
    this.storageService.rendererStorageCommandDelete(Types.Camera);
  }

  ngOnInit(): void {}
}
