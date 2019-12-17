import { Injectable } from '@angular/core';
import { EngineService } from '../modules/engine/engine.service';
import { SceneService } from "@modules/engine/core/base/scene.service";

@Injectable()
export class OnWindowEventService {
  resize(event?: Event, elem?: HTMLCanvasElement) {
    let width = window.innerWidth,
      height = window.innerHeight;

    if (elem) {
      width = elem.clientWidth;
      height = elem.clientHeight;

      let canvas = elem.querySelectorAll('canvas')[0];

      if (canvas){
        canvas.width = elem.clientWidth;
        canvas.height = elem.clientHeight;
        // console.log(canvas);
        // console.log(canvas.clientWidth);
        // console.log(canvas.clientHeight)
      }
    //  Разобраться почему изначально приходит не правильная ширина и высота
    //   this.engineService.cameraService.initCameras();

    }


    // console.log(elem);
    // console.log(width / height);

    this.engineService.settingsService.changeSetting('browser', {
      aspectRatio: width / height
    });

    this.engineService.sceneService.resizeEvent(event, {width, height});
    this.engineService.cameraService.initCameras();
  }

  updateCameries(){
    // let camera = this.engineService.cameraService.cameries[]
  }

  constructor(private engineService: EngineService) {
    this.resize();
  }

  onResize(event: Event, elem: HTMLCanvasElement) {
    this.resize(event, elem);
  }
}
