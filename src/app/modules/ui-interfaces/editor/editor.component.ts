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

  ngOnInit() {
    console.log(this.scene.nativeElement)

    this.engineService.settings = {
      camera: {
        d: 40
      }
    };

    this.engineService.init();
    this.scene.nativeElement.appendChild( this.engineService.domElement ) ;

    console.log(this.scene.nativeElement)

  }

}
