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

  defaultCheckedKeys = [];
  defaultSelectedKeys = ['0-0-0'];
  defaultExpandedKeys = ['0-0', '0-0-0', '0-0-1'];

  nodes = [
  ];

  // nodes = [
  //   {
  //     title: 'parent 1',
  //     key: '100312',
  //     children: [
  //       {
  //         title: 'parent 1-0',
  //         key: '1001',
  //         children: [
  //           { title: 'leaf 1-0-0', key: '10010', isLeaf: true },
  //           { title: 'leaf 1-0-1', key: '10011', isLeaf: true }
  //         ]
  //       },
  //       {
  //         title: 'parent 1-1',
  //         key: '1002',
  //         children: [
  //           { title: 'leaf 1-1-0', key: '10020', isLeaf: true },
  //           { title: 'leaf 1-1-1', key: '10021', isLeaf: true }
  //         ]
  //       }
  //     ]
  //   }
  // ];

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
      this.layersList();
      this.changeDetectorRef.detectChanges();
    });
  }

  ngAfterViewInit() {}

  public layersList() {
    if (this.engineService.sceneService.scene) {
      for (let obj of this.engineService.sceneService.scene.children) {
        let node = this.nodes.find(node => {
          return node.key === obj.type
        });

        //TODO: подумать над тем нужен ли отдельный кей
        if (!node){
          node = {
            title: obj.type,
            key: obj.type,
            element: obj,
          };

          this.nodes.push(node);
        }

        // if (node && node.key === 'Group'){
        //   console.log(node.key);
        //   console.log(node.element.children.length);
          // for (let i = 0; i < node.element.children.length; i++) {
          //   let groupChild = node.element.children[i];
          //   node.children.push({
          //     title: groupChild.type,
          //     key: groupChild.type,
          //     element: groupChild
          //   })
          // }
        // } else

        if (node) {

          if (!node.children){
            node.children = [];
          }

          console.log(node.key);
          node.children.push({
            title: `${obj.type}-${obj.uuid}`,
            key: obj.uuid,
            element: obj,
            isLeaf: true,
            isSelected: true
          });

          this.defaultCheckedKeys.push(obj.uuid);
        }

      }
      // this.engineService.sceneService.scene.children = [];
      console.log(this.nodes);
      console.log(this.engineService.sceneService.scene.children)
    }
  }

}
