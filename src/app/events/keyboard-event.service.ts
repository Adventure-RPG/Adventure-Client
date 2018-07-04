import { Injectable } from '@angular/core';
import { SettingsService } from '../services/settings.service';
import { CAMERA } from '../enums/settings.enum';

import { Key } from 'ts-keycode-enum';
import { EngineService } from '../modules/engine/engine.service';

@Injectable()
export class KeyboardEventService {
  constructor(private settingsService: SettingsService) {}

  engineService: EngineService;

  keyboardPressEvent(event: KeyboardEvent) {
    console.log(event);

    if (event.ctrlKey && event.altKey) {
      event.preventDefault();
      this.ctrlAndAltEvent(event);
    } else if (event.ctrlKey && !event.altKey) {
      event.preventDefault();
      this.ctrlAndNotAltEvent(event);
    } else if (!event.ctrlKey && event.altKey) {
      event.preventDefault();
      this.notCtrlAndAltEvent(event);
    } else if (!event.ctrlKey && !event.altKey) {
      this.notCtrlAndNotAltEvent(event);
    }
  }

  ctrlAndAltEvent(event: KeyboardEvent) {
    console.log(event);
  }

  ctrlAndNotAltEvent(event: KeyboardEvent) {
    console.log(event);
    switch (event.key) {
      case 'r':
        //TODO: Добавить блок на уровне localstorage
        location.reload();
        break;
      default:
        break;
    }
  }

  notCtrlAndAltEvent(event: KeyboardEvent) {
    switch (event.key) {
      case '1':
        this.settingsService.changeSetting('camera', { type: CAMERA.IsometricCamera });
        console.log(event);
        break;
      case '2':
        this.settingsService.changeSetting('camera', { type: CAMERA.MapCamera });
        // this.settingsService.changeSetting("camera", {type: CAMERA.PerspectiveCamera});
        console.log(event);
        break;
      case '3':
        this.settingsService.changeSetting('camera', { type: CAMERA.OrthographicCamera });
        console.log(event);
        break;
      case '4':
        this.settingsService.changeSetting('camera', { type: CAMERA.FirstPersonCamera });
        console.log(event);
        break;
      default:
        console.log(event);
        break;
    }
  }

  notCtrlAndNotAltEvent(event: KeyboardEvent) {
    switch (event.keyCode) {
      case Key.RightArrow:
      case Key.D:
        this.engineService.updateCamera(10, 5, 0);
        console.log(this.engineService);
        console.log(Key.D);
        break;
      case Key.LeftArrow:
      case Key.A:
        this.engineService.updateCamera(-10, -5, 0);
        console.log(this.engineService);
        console.log(Key.A);
        break;
      case Key.UpArrow:
      case Key.W:
        this.engineService.updateCamera(0, 10, 0);
        console.log(this.engineService);
        console.log(Key.W);
        break;
      case Key.DownArrow:
      case Key.S:
        this.engineService.updateCamera(0, -10, 0);
        console.log(this.engineService);
        console.log(Key.S);
        break;
      default:
        console.log(event);
        break;
    }
  }
}
