import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {EngineService} from "../../engine/engine.service";
import {LightService} from "../../engine/light.service";
import { HeightMapService } from "../../engine/height-map.service";

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
    private heightMapService: HeightMapService,
    private elementRef: ElementRef
  ) {
    // this.engineService.renderEngine();
  }

  public mouseData = {
    dragStart: null,
    dragMove:  null,
    dragEnd:   null,
  };

  dragStartMouse(event){
    this.mouseData.dragStart = event;
    console.log(event)
  }

  dragMoveMouse(event){
    if (this.mouseData.dragStart){
      this.mouseData.dragMove = event;

      let x = this.mouseData.dragStart.offsetX - this.mouseData.dragMove.offsetX;
      let y = this.mouseData.dragStart.offsetY - this.mouseData.dragMove.offsetY;
      console.log(event)
      this.engineService.updateCamera(x, y)
    }
  }

  dragEndMouse(event){
    this.mouseData.dragStart = null;
    this.mouseData.dragEnd = event;
    console.log(event)
  }

  mouseWheel(event){

    let d = this.engineService.settings.camera.d += event.deltaY/100;
    this.engineService.settings = {
      camera: {
        d: d
      }
    };

    console.log(this.engineService.settings)
  }

  ngOnInit() {
    this.engineService.settings = {
      camera: {
        d: 40
      }
    };

    this.engineService.init();
    this.scene.nativeElement.appendChild( this.engineService.domElement ) ;


    let hemisphereLightOptions = {
      color: "#aaa",
      groundColor: "#777",
      intensity: 0.9,
      distance: 200,
      exponent: 0,
      angle: 0.52,
      decay: 2,
      position : {
        x: 30,
        y: 30,
        z: 30
      }
    };

    let pointLightOptions = {
      color: "#fff",
      groundColor: "#444444",
      intensity: 1,
      distance: 200,
      exponent: 0,
      angle: 0.52,
      decay: 2,
      position : {
        x: 0,
        y: 20,
        z: 0
      }
    };


    let ambientLightOptions = {
      color: "#dc8874",
      groundColor: "#444444",
      intensity: .5,
      distance: 200,
      exponent: 0,
      angle: 0.52,
      decay: 2,
      position : {
        x: 200,
        y: 200,
        z: 200
      }
    };


    let directionalLightOptions = {
      color: "#fff",
      groundColor: "#444444",
      intensity: .9,
      distance: 200,
      exponent: 0,
      angle: 0.52,
      decay: 2,
      position : {
        x: 200,
        y: 200,
        z: 0
      },
      shadow: {
        castShadow: true,
        camera: {
          left: -400,
          right: 400,
          top: 400,
          bottom: -400,
          near: 1,
          far: 1000
        }
      }
    };


    this.lightService.addLight(hemisphereLightOptions, "HemisphereLight");

    this.lightService.addLight(pointLightOptions, "PointLight");

    // this.lightService.addLight(ambientLightOptions, "AmbientLight");

    // this.lightService.addLight(directionalLightOptions, "DirectionalLight");

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
