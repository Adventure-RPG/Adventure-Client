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

    let d = this.settingsService.camera.d;
    console.log(this.camera);
    console.log(d);

    if (!this.camera){
      this.initIsometricCamera();
    } else {
      this.updateIsometricCamera();
    }

    this.camera.lookAt( position ); // or the origin

    return this.camera;

    // test only
    // this.sceneService.renderer.render(this.scene, this.camera);
  }

  public initIsometricCamera(){
    let d = this.settingsService.camera.d;
    this.camera = new OrthographicCamera(
      - d * this.settingsService.browser.aspectRatio,
      d * this.settingsService.browser.aspectRatio,
      d,
      - d,
      1,
      d * 40
    );
    this.camera.position.set( d * 8, d * 8, d * 8); // all components equal
  };

  public updateIsometricCamera(){

    let d = this.settingsService.camera.d;

    (<OrthographicCamera>this.camera).left = - d * this.settingsService.browser.aspectRatio;
    (<OrthographicCamera>this.camera).right = - d * this.settingsService.browser.aspectRatio;
    (<OrthographicCamera>this.camera).top = d;
    (<OrthographicCamera>this.camera).bottom = - d;
    (<OrthographicCamera>this.camera).near = 1;
    (<OrthographicCamera>this.camera).far = d * 40;

    this.camera.position.set( d * 8, d * 8, d * 8);
  };

  ngOnInit(): void {
  }
}
