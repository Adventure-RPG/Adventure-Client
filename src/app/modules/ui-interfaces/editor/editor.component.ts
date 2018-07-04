import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EngineService } from '../../engine/engine.service';
import { LightService } from '../../engine/core/light.service';
import { HeightMapService } from '../../engine/core/3d-helpers/height-map.service';
import { SettingsService } from '../../../services/settings.service';
import { KeyboardEventService } from '../../../events/keyboard-event.service';
import { SceneEventsDirective } from '../../../shared/directives/scene-events.directive';

//TODO: вынести в инциацию сцен
@Component({
  selector: 'adventure-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {
  @ViewChild('scene') scene;

  constructor(
    private engineService: EngineService,
    private lightService: LightService,
    private settingsService: SettingsService,
    public keyboardEventService: KeyboardEventService,
    private heightMapService: HeightMapService,
    private elementRef: ElementRef
  ) {
    // this.engineService.renderEngine();
  }

  public mouseData = {
    dragStart: null,
    dragMove: null,
    dragEnd: null
  };

  dragStartMouse(event) {
    this.mouseData.dragStart = event;
    console.log(event);
  }

  dragMoveMouse(event) {
    if (this.mouseData.dragStart) {
      this.mouseData.dragMove = event;

      // let x = this.mouseData.dragStart.offsetX - this.mouseData.dragMove.offsetX;
      // let y = this.mouseData.dragStart.offsetY - this.mouseData.dragMove.offsetY;
      // console.log(event)
      // console.log(`${this.engineService.sceneService.scene && this.settingsService.settings && this.settingsService.settings.camera && this.settingsService.settings.camera.d}`);
      // //
      // if (this.engineService.sceneService.scene && this.settingsService.settings && this.settingsService.settings.camera && this.settingsService.settings.camera.d) {
      //   this.engineService.updateCamera(x, y, 0);
      // }
    }
  }

  dragEndMouse(event) {
    this.mouseData.dragStart = null;
    this.mouseData.dragEnd = event;
    // console.log(this.engineService.sceneService.scene)
    // console.log(event);
  }

  mouseWheel(event) {
    this.settingsService.changeSetting('camera', {
      d: this.settingsService.settings.camera.d + event.deltaY / 100
    });

    // TODO: delete if not needed
    // if (
    //   this.engineService.sceneService.scene &&
    //   this.settingsService &&
    //   this.settingsService.settings.camera &&
    //   this.settingsService.settings.camera.d
    // ) {
    //   this.engineService.updateCamera();
    // }
  }

  ngOnInit() {
    this.settingsService.settings$.subscribe(() => {
      this.engineService.updateCamera();
    });

    console.log('init');

    this.engineService.init();
    this.scene.nativeElement.appendChild(this.engineService.sceneService.renderer.domElement);

    this.keyboardEventService.engineService = this.engineService;

    let hemisphereLightOptions = {
      color: '#aaa',
      groundColor: '#777',
      intensity: 0.9,
      distance: 200,
      exponent: 0,
      angle: 0.52,
      decay: 2,
      position: {
        x: 30,
        y: 30,
        z: 30
      }
    };

    let pointLightOptions = {
      color: '#89ff90',
      groundColor: '#444444',
      intensity: 1,
      distance: 250,
      exponent: 0,
      angle: 0.52,
      decay: 1,
      position: {
        x: 0,
        y: 40,
        z: 0
      }
    };

    let ambientLightOptions = {
      color: '#dc8874',
      groundColor: '#444444',
      intensity: 0.5,
      distance: 200,
      exponent: 0,
      angle: 0.52,
      decay: 2,
      position: {
        x: 200,
        y: 200,
        z: 200
      }
    };

    let directionalLightOptions = {
      color: '0xffffff',
      groundColor: '#fff',
      intensity: 1,
      distance: 200,
      exponent: 0,
      angle: 1.52,
      decay: 2,
      position: {
        x: 0,
        y: 50,
        z: 50
      },
      shadow: {
        castShadow: true,
        camera: {
          left: -400,
          right: 400,
          top: 400,
          bottom: -400,
          near: 0.5,
          far: 1000
        }
      }
    };

    let spotLightOptions = {
      color: '0xffffff',
      groundColor: '#fff',
      intensity: 0.5,
      distance: 2500,
      exponent: 0,
      angle: 1.52,
      decay: 2,
      position: {
        x: 0,
        y: 150,
        z: 100
      }
    };

    // this.lightService.addLight(hemisphereLightOptions, "HemisphereLight");

    // this.lightService.addLight(pointLightOptions, "PointLight");

    this.lightService.addLight(ambientLightOptions, 'AmbientLight');

    // this.lightService.addLight(directionalLightOptions, "DirectionalLight");

    this.lightService.addLight(spotLightOptions, 'SpotLight');

    // let ochenEbaniiTest: HTMLImageElement = document.createElement("img");
    // ochenEbaniiTest.src = require("tests/assets/colormap/ColorMap-2.png");
    //
    // let ochenEbaniiTest2: HTMLImageElement = document.createElement("img");
    // ochenEbaniiTest.src = require("tests/assets/colormap/heightArena.png");
    //
    //
    // this.heightMapService.changeColorMapFromImage({}, this.engineService.scene, ochenEbaniiTest);
    // this.heightMapService.changeMapFromImage({}, this.engineService.scene, ochenEbaniiTest2); mn 3w
  }
}
