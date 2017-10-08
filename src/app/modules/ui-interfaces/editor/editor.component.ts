import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {EngineService} from "../../engine/engine.service";

@Component({
  selector: 'adventure-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

  @ViewChild('scene') scene;

  constructor(
    private engineService: EngineService,
    private elementRef: ElementRef
  ) {
    // this.engineService.renderEngine();
  }

  dragMouse(event){
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
        d: 20
      }
    };

    this.engineService.init();
    this.scene.nativeElement.appendChild( this.engineService.domElement ) ;

  }

}
