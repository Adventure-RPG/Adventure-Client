import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {EngineService} from "../../engine/engine.service";
import {LightService} from "../../engine/light.service";

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


    let light = {
      color: "#fff",
      groundColor: "#127bdc",
      intensity: 0.01,
      distance: 200,
      exponent: 0,
      angle: 0.52,
      decay: 2,
      position : {
        x: 0,
        y: 50,
        z: 0
      }
    };


    this.lightService.addLight(light, "PointLight");

  }

}
