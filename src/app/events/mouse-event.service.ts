import { Injectable } from '@angular/core';
import { SettingsService } from '@services/settings.service';
import { CAMERA } from '@enums/settings.enum';
import { EngineService } from '@modules/engine/engine.service';
import { StorageService } from '@services/storage.service';


@Injectable()
export class MouseEventService {
  constructor(private settingsService: SettingsService, private storageService: StorageService) {}

  engineService: EngineService;


}
