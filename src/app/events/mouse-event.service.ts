import { Injectable } from '@angular/core';
import { SettingsService } from '@services/settings.service';
import { EngineService } from '@modules/engine/engine.service';
import { StorageService } from '@services/storage.service';

@Injectable()
export class MouseEventService {
  constructor(private settingsService: SettingsService, private storageService: StorageService) {}

  engineService: EngineService;

  mousePressEvent(event: MouseEvent) {
    /**
       Обработчик эвентов на мышку
        **/

    for (let sceneCommandName in this.storageService.hotkeySceneCommands) {
      if (
        typeof this.storageService.hotkeySceneCommands[sceneCommandName].keyCode === 'number' &&
        <string>this.storageService.hotkeySceneCommands[sceneCommandName].name === event.type
      ) {
        this.storageService.hotkeySceneCommands[sceneCommandName].onMouse(event);
      }
    }
  }
}
