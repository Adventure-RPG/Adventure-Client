import { Injectable } from '@angular/core';
import {SettingsService} from '../services/settings.service';
import {CAMERA} from '../enums/settings.enum';

@Injectable()
export class KeyboardEventService {

  constructor(private settingsService: SettingsService) {

  }

  keyboardPressEvent(event: KeyboardEvent){
    if (event.ctrlKey && event.altKey){
      event.preventDefault();
      this.ctrlAndAltEvent(event);
    } else if ( event.ctrlKey && !event.altKey){
      event.preventDefault();
      this.ctrlAndNotAltEvent(event);
    } else if (!event.ctrlKey &&  event.altKey){
      event.preventDefault();
      this.notCtrlAndAltEvent(event);
    } else if (!event.ctrlKey && !event.altKey){
      this.notCtrlAndNotAltEvent(event);
    };
  }

  ctrlAndAltEvent(event: KeyboardEvent){
    console.log(event);
  }

  ctrlAndNotAltEvent(event: KeyboardEvent){
    console.log(event);
  }

  notCtrlAndAltEvent(event: KeyboardEvent){

    switch (event.key){
      case "1":
        this.settingsService.changeSetting("camera", {type: CAMERA.IsometricCamera});
        console.log(event);
        break;
      case "2":
        this.settingsService.changeSetting("camera", {type: CAMERA.MapCamera});
        // this.settingsService.changeSetting("camera", {type: CAMERA.PerspectiveCamera});
        console.log(event);
        break;
      case "3":
        this.settingsService.changeSetting("camera", {type: CAMERA.OrthographicCamera});
        console.log(event);
        break;
      default:
        console.log(event);
        break;
    }

  }

  notCtrlAndNotAltEvent(event: KeyboardEvent){
    console.log(event);
  }

}
