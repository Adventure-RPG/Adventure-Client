import {Injectable, OnInit} from '@angular/core';
import {Camera, OrthographicCamera} from 'three';
import {EngineService} from '../../engine.service';
import {SettingsService} from '../../../../services/settings.service';

@Injectable()
export class CameraService implements OnInit{

  private _camera: Camera | OrthographicCamera;
  private _cameries: {[key: string]: Camera | OrthographicCamera};

  constructor(
    private settingsService: SettingsService
  ) { }

  get camera(): Camera | OrthographicCamera{
    return this._camera;
  }

  set camera(value: Camera | OrthographicCamera) {
    this._camera = value;
  }

  get cameries(): { [p: string]: Camera | OrthographicCamera } {
    return this._cameries;
  }

  set cameries(value: { [p: string]: Camera | OrthographicCamera }) {
    this._cameries = value;
  }

  public updateCamera(position, x?, y?, z?){

    if (!x){x = 0}
    if (!y){y = 0}
    if (!z){z = 0}

    if (!this.camera) {
      this.initIsometricCamera();
    } else {
      //TODO: разобраться что за хуйня с камерой
      this.initIsometricCamera();
      // this.updateIsometricCamera();
    }

    this.camera.lookAt( position ); // or the origin

    return this.camera;
  }

  public initIsometricCamera(){
    let d = this.settingsService.settings.camera.d;
    this.camera = new OrthographicCamera(
      - d * this.settingsService.settings.browser.aspectRatio,
      d * this.settingsService.settings.browser.aspectRatio,
      d,
      - d,
      1,
      d * 40
    );
    this.camera.position.set( d * 8, d * 8, d * 8); // all components equal
  };

  public updateIsometricCamera(){

    let d = this.settingsService.settings.camera.d;

    (<OrthographicCamera>this.camera).left = - d * this.settingsService.settings.browser.aspectRatio;
    (<OrthographicCamera>this.camera).right = - d * this.settingsService.settings.browser.aspectRatio;
    (<OrthographicCamera>this.camera).top = d;
    (<OrthographicCamera>this.camera).bottom = - d;
    (<OrthographicCamera>this.camera).near = 1;
    (<OrthographicCamera>this.camera).far = d * 40;

    this.camera.position.set( d * 8, d * 8, d * 8);
  };

  ngOnInit(): void {
  }
}
