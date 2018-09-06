import { Injectable } from '@angular/core';
import { SettingsService } from '@services/settings.service';
import { CAMERA } from '@enums/settings.enum';
import { EngineService } from '@modules/engine/engine.service';
import { StorageService } from '@services/storage.service';

@Injectable()
export class KeyboardEventService {
  constructor(private settingsService: SettingsService, private storageService: StorageService) {}

  engineService: EngineService;

  keyboardPressEvent(event: KeyboardEvent) {
    console.log(event);
    /**
     * TODO:
     * В этот сервис тебе надо загнать все кейборд ивенты
     * event.preventDefault() - прерывает все ивенты
     */

    if (event.ctrlKey && event.altKey) {
      // event.preventDefault();
      this.ctrlAndAltEvent(event);
    } else if (event.ctrlKey && !event.altKey) {
      // event.preventDefault();
      this.ctrlAndNotAltEvent(event);
    } else if (!event.ctrlKey && event.altKey) {
      // event.preventDefault();
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
    /**
     * Обработчик хоткеи ивентов.
     */
    for (let sceneCommandName in this.storageService.hotkeySceneCommands) {
      //Сравниваем по типу, потом по кей коду, если есть то исполняем

      if (
        typeof this.storageService.hotkeySceneCommands[sceneCommandName].keyCode === 'number' &&
        <number>this.storageService.hotkeySceneCommands[sceneCommandName].keyCode === event.keyCode
      ) {
        if (event.type === 'keyup') {
          this.storageService.hotkeySceneCommands[sceneCommandName].onKeyUp(event);
        } else if (event.type === 'keydown') {
          this.storageService.hotkeySceneCommands[sceneCommandName].onKeyDown(event);
        }
      } else if (
        typeof this.storageService.hotkeySceneCommands[sceneCommandName].keyCode === 'object' &&
        (<number[]>this.storageService.hotkeySceneCommands[sceneCommandName].keyCode).indexOf(
          event.keyCode
        ) !== -1
      ) {
        if (event.type === 'keyup') {
          this.storageService.hotkeySceneCommands[sceneCommandName].onKeyUp(event);
        } else if (event.type === 'keydown') {
          this.storageService.hotkeySceneCommands[sceneCommandName].onKeyDown(event);
        }
      }
    }
  }
}
