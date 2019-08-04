import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { EngineService } from '../../../engine/engine.service';

@Component({
  selector: 'adventure-layers',
  templateUrl: './layers.component.html',
  styleUrls: ['./layers.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayersComponent implements OnInit, AfterViewInit {
  constructor(public engineService: EngineService, private changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.engineService.initStatus.subscribe(() => {
      console.log(this.engineService.sceneService.scene);
      this.layersList();
      this.changeDetectorRef.detectChanges();
    });
  }

  ngAfterViewInit() {}

  public layersList() {
    if (this.engineService.sceneService.scene) {
      // for (let obj of this.engineService.scene.children) {
      //   console.log(obj.type);
      // };
      // this.engineService.scene.children = [];
      // console.log(this.engineService.scene.children)
    }
  }
}
