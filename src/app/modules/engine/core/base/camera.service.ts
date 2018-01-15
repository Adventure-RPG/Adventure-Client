import {Injectable, OnInit} from '@angular/core';
import {Camera, OrthographicCamera} from 'three';
import {EngineService} from '../../engine.service';
import {SettingsService} from '../../../../services/settings.service';
import * as Lodash from 'lodash';
import {CAMERA} from '../../../../enums/settings.enum';

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

    console.log(this.settingsService.settings.camera.type);
    console.log(CAMERA.MapCamera);


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
    this.camera = this.cameries["initCamera"];
    this.camera = new OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 1000 );
    this.camera.position.set( 80, 80, 80); // all components equal
    let obj = {};
    obj["init2dCamera"] = this.camera;
    let mergeModel = Lodash.merge(this.cameries, obj);
    this.cameries = mergeModel;

  };

  public update2dCamera(){
    this.camera = new OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 1000 );
    this.camera.position.set( 80, 80, 80); // all components equal
  }

  ngOnInit(): void {
  }
}
