import { Injectable } from '@angular/core';
import {Camera, OrthographicCamera} from 'three';
import {EngineService} from '../../engine.service';
import {SettingsService} from '../../../../services/settings.service';

@Injectable()
export class CameraService {

  private _camera: Camera;

  constructor(
    private settingsService: SettingsService
  ) { }

  get camera(): Camera {
    return this._camera;
  }

  set camera(value: Camera) {
    this._camera = value;
  }

  public updateCamera(position, x?, y?, z?){
    if (!x){ x = 0 }
    if (!y){ y = 0 }
    if (!z){ z = 0 }
    let aspect = window.innerWidth / window.innerHeight;
    let d = this.settingsService.camera.d;
    console.log(this.camera);
    this.camera = new OrthographicCamera( - d * aspect, d * aspect, d, - d, 1, d * 40 );
    this.camera.position.set( d * 8, d * 8, d * 8); // all components equal
    this.camera.lookAt( position ); // or the origin
    console.log(this.camera);
    console.log(d);

    // test only
    // this.sceneService.renderer.render(this.scene, this.camera);
  }

}
