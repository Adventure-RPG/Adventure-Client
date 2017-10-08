import {Component, Input, OnInit} from '@angular/core';
import {OnNew} from "../../../../../decorators/on-new.decorator";

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

  constructor() { }

  ngOnInit() {
  }

}
