import { MouseCommandsEnum } from '@enums/mouseCommands.enum';
import { KeyboardCommandsEnum } from 'app/enums/keyboardCommands.enum';

export class CameraControls {
  storageService;
  constructor(storageService) {
    this.storageService = storageService;
    this.initCommands();
  }

  initCommands() {
    for (const key in MouseCommandsEnum) {
      this.storageService.hotkeySceneCommandPush(key, {});
    }
    for (const key in KeyboardCommandsEnum) {
      this.storageService.hotkeySceneCommandPush(key, {});
    }
  }
}
