import {Injectable} from '@angular/core';
import {EngineService} from '../modules/engine/engine.service';

@Injectable()
export class OnWindowEventService {
  constructor(
    private engineService: EngineService,
  ) {
    this.engineService.settingsService.changeSetting('browser', {
      aspectRatio: window.innerWidth / window.innerHeight
    });
    this.engineService.sceneService.resizeEvent(event);
  }

  onResize(event: Event) {
    // (<OrthographicCamera>this.engineService.cameraService.camera).aspect = window.innerWidth / window.innerHeight;
    this.engineService.settingsService.changeSetting('browser', {
      aspectRatio: window.innerWidth / window.innerHeight
    });
    this.engineService.sceneService.resizeEvent(event);

    console.log(event);
    console.log(this.engineService.settingsService.settings.browser);
  }
}
