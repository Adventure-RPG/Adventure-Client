import { Injectable } from '@angular/core';
import { EngineService } from '../modules/engine/engine.service';

@Injectable()
export class OnWindowEventService {
  resize() {
    this.engineService.settingsService.changeSetting('browser', {
      aspectRatio: window.innerWidth / window.innerHeight
    });
    this.engineService.sceneService.resizeEvent(event);
  }

  constructor(private engineService: EngineService) {
    this.resize();
  }

  onResize(event: Event) {
    this.resize();
  }
}
