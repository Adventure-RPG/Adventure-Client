import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {EngineService} from "@modules/engine/engine.service";
import {NzFormatEmitEvent} from "ng-zorro-antd";
import {Mesh} from "three";
import {NzTreeNode} from "ng-zorro-antd/core/tree/nz-tree-base-node";

export interface Child {
  title: string;
  key: string;
  element: any;
  children: Child[];
}

@Component({
  selector: 'adventure-layers',
  templateUrl: './layers.component.html',
  styleUrls: ['./layers.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayersComponent implements OnInit, AfterViewInit {

  constructor(
    public engineService: EngineService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  nzEvent(event: NzFormatEmitEvent): void {
    console.log(event);
    // Корень
    if (event.node && event.eventName === 'check' && event.node.level === 0) {
      event.node.children.forEach((node: NzTreeNode) => {
        node.origin.element.traverse( (child) => {
          if (child) {
            child.visible = !child.visible;
          }
        });
      })
    } else if (event.node && event.eventName === 'check' && event.node.level !== 0) {
      // Для остальных уровней
      event.node.origin.element.traverse( (child) => {
        if (child) {
          child.visible = !child.visible;
        }
      });
    }
  }


  ngOnInit() {
    this.engineService.initStatus.subscribe(() => {
      console.log(this.engineService.sceneService.scene);
      this.engineService.sceneService.layersList();
      this.changeDetectorRef.detectChanges();
    });
  }

  ngAfterViewInit() {}


}
