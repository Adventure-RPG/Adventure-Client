import { Injectable } from '@angular/core';
import { SettingsService } from '@services/settings.service';
import { EngineService } from '@modules/engine/engine.service';
import { StorageService } from '@services/storage.service';

@Injectable()
export class MouseEventService {
  constructor(private settingsService: SettingsService, private storageService: StorageService) {}

  engineService: EngineService;

  mouseEvents(event: MouseEvent) {
    /**
     Обработчик эвентов на мышку
      **/
    for (let sceneCommandName in this.storageService.hotkeySceneCommands) {
      /**
       * Заменил number на object, потому что он всегда возвращает тип объект и нифига не работает.
       */
      //console.log(this.storageService.hotkeySceneCommands[sceneCommandName].name);
      if (
        typeof this.storageService.hotkeySceneCommands[sceneCommandName].keyCode === 'object' &&
        <string>this.storageService.hotkeySceneCommands[sceneCommandName].name === event.type
      ) {
        switch (event.type) {
          case 'keyup':
            this.storageService.hotkeySceneCommands[sceneCommandName].onKeyUp(event);
            break;
          case 'keydown':
            this.storageService.hotkeySceneCommands[sceneCommandName].onKeyDown(event);
            break;
          case 'onmousedown':
            this.storageService.hotkeySceneCommands[sceneCommandName].onMouseDown(event);
            break;
          case 'onmouseup':
            this.storageService.hotkeySceneCommands[sceneCommandName].onMouseUp(event);
            break;
          case 'mousemove':
            this.storageService.hotkeySceneCommands[sceneCommandName].onMouseMove(event);
            break;
          case 'mousewheel':
            this.storageService.hotkeySceneCommands[sceneCommandName].onMouse(event);
            break;
        }
      }
    }
  }
}
