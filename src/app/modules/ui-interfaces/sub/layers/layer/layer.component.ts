import {Component, Input, OnInit} from '@angular/core';
import {OnNew} from "../../../../../decorators/on-new.decorator";
import {EngineService} from "../../../../engine/engine.service";

@Component({
  selector: 'adventure-layer',
  templateUrl: './layer.component.html',
  styleUrls: ['./layer.component.scss']
})
export class LayerComponent implements OnInit {

  @Input() @OnNew <LayerComponent, any>(x => x.onNewLayer) layer: any;
  @Input() index: number;

  opened: boolean;

  onNewLayer() {

  }

  openedToggle(){
    console.log(this.layer);
    this.opened = !this.opened;
  }

  public deleteElement(element) {
    let index = this.engineService.sceneService.scene.children.indexOf(element);
    this.engineService.sceneService.scene.children.splice(index, 1);
  }

  constructor(
    public engineService: EngineService,
    ) { }

  ngOnInit() {
  }

}
