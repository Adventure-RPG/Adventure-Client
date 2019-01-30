import { StorageService } from '@services/storage.service';
import { MouseCommandsEnum } from '@enums/mouseCommands.enum';
import { KeyboardCommandsEnum } from 'app/enums/KeyboardCommands.enum';

export class CameraControls {
  storageService;
  constructor(storageService) {
    this.storageService = storageService;
    this.initCommands();
    console.log(this.storageService.hotkeySceneCommands);
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
