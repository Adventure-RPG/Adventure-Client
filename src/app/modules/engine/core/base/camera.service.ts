import {Injectable, OnInit} from '@angular/core';
import {Camera, CubeCamera, OrthographicCamera} from 'three';
import {EngineService} from '../../engine.service';
import {SettingsService} from '../../../../services/settings.service';
import * as Lodash from 'lodash';
import {CAMERA} from '../../../../enums/settings.enum';

@Injectable()
export class CameraService implements OnInit{

  private _camera: Camera | OrthographicCamera | CubeCamera;
  private _cameries: {[key: string]: Camera | OrthographicCamera | CubeCamera};

  constructor(
    private settingsService: SettingsService
  ) { }

  get camera(): Camera | OrthographicCamera | CubeCamera{
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

  public updateCamera(position, x?, y?, z?){

    if (!x){x = 0}
    if (!y){y = 0}
    if (!z){z = 0}

    // TODO: дописать апдейт к камере.

    if (!this.camera) {
      this.initIsometricCamera();
      this.init2dCamera();
    } else {
      if (this.settingsService.settings.camera.type === CAMERA.IsometricCamera) {
        this.updateIsometricCamera();
      } else if (this.settingsService.settings.camera.type === CAMERA.MapCamera){
        this.update2dCamera();
      }
    }

    this.camera.lookAt( position ); // or the origin

    return this.camera;
  }

  public initIsometricCamera(){
    let d = this.settingsService.settings.camera.d;

    //Остановился на добавление второго типа камеры и переключателя для камер.

    this.camera = new OrthographicCamera(
      - d * this.settingsService.settings.browser.aspectRatio,
      d * this.settingsService.settings.browser.aspectRatio,
      d,
      - d,
      1,
      d * 40
    );
    this.camera.position.set( d * 8, d * 8, d * 8); // all components equal
    let obj = {};
    obj["isometricCamera"] = this.camera;
    let mergeModel = Lodash.merge(this.cameries, obj);
    this.cameries = mergeModel;

  };

  public updateIsometricCamera(){

    let d = this.settingsService.settings.camera.d;
    this.camera = this.cameries["isometricCamera"];

    (<OrthographicCamera>this.camera).left = - d * this.settingsService.settings.browser.aspectRatio;
    (<OrthographicCamera>this.camera).right = - d * this.settingsService.settings.browser.aspectRatio;
    (<OrthographicCamera>this.camera).top = d;
    (<OrthographicCamera>this.camera).bottom = - d;
    (<OrthographicCamera>this.camera).near = 1;
    (<OrthographicCamera>this.camera).far = d * 40;

    this.camera.position.set( d * 8, d * 8, d * 8);
  };

  public init2dCamera(){

    let d = this.settingsService.settings.camera.d;
    this.camera = this.cameries["initCamera"];

    this.camera = new CubeCamera( 1, d * 40, 128);
    this.camera.position.set( 0, d * 4, 0); // all components equal

    let obj = {};
    obj["init2dCamera"] = this.camera;
    let mergeModel = Lodash.merge(this.cameries, obj);
    this.cameries = mergeModel;

  };

  public update2dCamera(){
    let d = this.settingsService.settings.camera.d;
    this.camera.position.set( 0, d * 4, 0); // all components equal
  }

  ngOnInit(): void {
  }
}
