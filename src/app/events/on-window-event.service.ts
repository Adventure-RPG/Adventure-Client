import { Injectable } from '@angular/core';
import {EngineService} from '../modules/engine/engine.service';
import {OrthographicCamera} from 'three';
import {SettingsService} from '../services/settings.service';

@Injectable()
export class OnWindowEventService {

  constructor(
    private engineService: EngineService,
  ) { }

  onResize(event: Event) {

    // (<OrthographicCamera>this.engineService.cameraService.camera).aspect = window.innerWidth / window.innerHeight;
    this.engineService.settingsService.changeSetting("browser", {"aspectRatio": window.innerWidth / window.innerHeight});
    this.engineService.sceneService.resizeEvent(event);

    console.log(event);
  }

}
