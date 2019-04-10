import { Component, OnInit } from '@angular/core';
import { EngineService } from '../../engine/engine.service';
import { StorageService } from '@services/storage.service';
import { Types } from '@enums/types.enum';
import { MouseCommandsEnum } from '@enums/mouseCommands.enum';

declare const THREE;

@Component({
  selector: 'adventure-scene-test',
  templateUrl: './scene-test.component.html',
  styleUrls: ['./scene-test.component.scss']
})
export class SceneTestComponent implements OnInit {
  sceneService;
  scene;
  camera;
  renderer;
  selectionBox;
  helper;
  constructor(private engineService: EngineService, private storageService: StorageService) {
    this.engineService.init();
    this.selectionBox = new THREE.SelectionBox(
      this.engineService.sceneService.camera,
      this.engineService.sceneService.scene
    );
    this.helper = new THREE.SelectionHelper(
      this.selectionBox,
      this.engineService.sceneService.renderer,
      'selectBox'
    );

    this.storageService.hotkeySceneCommandPush(MouseCommandsEnum.mouseDown, {
      type: Types.Camera,
      onMouseDown: (event: MouseEvent) => {
        this.selectionBox.startPoint.set(
          (event.clientX / window.innerWidth) * 2 - 1,
          -(event.clientY / window.innerHeight) * 2 + 1,
          0.5
        );
      },
      pressed: false,
      keyCode: [NaN],
      name: 'mouseDown'
    });

    this.storageService.hotkeySceneCommandPush(MouseCommandsEnum.mouseUp, {
      type: Types.Camera,
      onMouseUp: (event: MouseEvent) => {
        this.selectionBox.endPoint.set(
          (event.clientX / window.innerWidth) * 2 - 1,
          -(event.clientY / window.innerHeight) * 2 + 1,
          0.5
        );
        let allSelected = this.selectionBox.select();
        for (let i = 0; i < allSelected.length; i++) {
          allSelected[i].material.emissive = new THREE.Color(0x0000ff);
        }
      },
      pressed: false,
      keyCode: [NaN],
      name: 'mouseUp'
    });

    this.storageService.hotkeySceneCommandPush(MouseCommandsEnum.onMouseMove, {
      type: Types.Camera,
      onMouseMove: (event: MouseEvent) => {
        if (this.helper.isDown) {
          for (let i = 0; i < this.selectionBox.collection.length; i++) {
            this.selectionBox.collection[i].material.emissive = new THREE.Color(0x000000);
          }
          this.selectionBox.endPoint.set(
            (event.clientX / window.innerWidth) * 2 - 1,
            -(event.clientY / window.innerHeight) * 2 + 1,
            0.5
          );
          let allSelected = this.selectionBox.select();
          for (let i = 0; i < allSelected.length; i++) {
            allSelected[i].material.emissive = new THREE.Color(0x0000ff);
          }
        }
      },
      pressed: false,
      keyCode: [NaN],
      name: 'mouseMove'
    });
  }

  ngOnInit() {}
}
