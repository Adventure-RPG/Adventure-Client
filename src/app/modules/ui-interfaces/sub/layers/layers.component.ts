import {AfterViewInit, Component, OnInit} from '@angular/core';
import {EngineService} from "../../../engine/engine.service";

@Component({
  selector: 'adventure-layers',
  templateUrl: './layers.component.html',
  styleUrls: ['./layers.component.scss']
})
export class LayersComponent implements OnInit, AfterViewInit {

  constructor(
    private engineService: EngineService,
  ) {}

  ngOnInit() {}

  ngAfterViewInit(){
    this.layersList();
  }

  public layersList(){
    if (this.engineService.scene){
      for (let obj of this.engineService.scene.children) {
        console.log(obj.type);
      };
      // this.engineService.scene.children = [];
      // console.log(this.engineService.scene.children)
    }
  }

}
