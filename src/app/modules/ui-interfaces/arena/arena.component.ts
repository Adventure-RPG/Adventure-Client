import { Component, OnInit, ViewChild } from '@angular/core';
import { Color, GridHelper, Mesh, MeshPhongMaterial, PlaneGeometry } from 'three';
import { KeyboardEventService } from '@events/keyboard-event.service';
import { LightService } from '@modules/engine/core/light.service';
import { EngineService } from '@modules/engine/engine.service';
import { SettingsService } from '@services/settings.service';
import { StorageService } from '@services/storage.service';
import { MouseCommandsEnum } from '@enums/mouseCommands.enum';
import { Types } from '@enums/types.enum';

import 'three-full/sources/shaders/CopyShader';
import 'three-full/sources/shaders/FXAAShader';
import { EffectComposer } from 'three-full/sources/postprocessing/EffectComposer';
import 'three-full/sources/postprocessing/RenderPass';
import 'three-full/sources/postprocessing/ShaderPass';
import 'three-full/sources/postprocessing/OutlinePass';
import { SelectionBox } from 'three-full/sources/interactive/SelectionBox';
import { SelectionHelper } from 'three-full/sources/interactive/SelectionHelper';
import { Lightning } from '@modules/engine/core/utils/lightning';
import { BoxGeometry } from '@node_modules/three-full/sources/geometries/BoxGeometry';
import { MeshBasicMaterial } from '@node_modules/three-full/sources/materials/MeshBasicMaterial';
import { Vector3 } from '@node_modules/three-full/sources/math/Vector3';

@Component({
  selector: 'adventure-arena',
  templateUrl: './arena.component.html',
  styleUrls: ['./arena.component.scss']
})
export class ArenaComponent implements OnInit {
  @ViewChild('scene', { static: true }) scene;

  sceneService;
  camera;
  renderer;
  selectionBox;
  helper;

  constructor(
    private engineService: EngineService,
    private lightService: LightService,
    private settingsService: SettingsService,
    public keyboardEventService: KeyboardEventService,
    private storageService: StorageService
  ) {}
  // this.engineService.renderEngine();

  ngOnInit() {
    // console.log('adada');
    this.engineService.init();
    this.selectionBox = new SelectionBox(
      this.engineService.sceneService.camera,
      this.engineService.sceneService.scene
    );
    this.helper = new SelectionHelper(
      this.selectionBox,
      this.engineService.sceneService.renderer,
      'selectBox'
    );

    this.settingsService.settings$.subscribe(() => {
      this.engineService.updateCamera();
    });

    this.engineService.init();
    this.scene.nativeElement.appendChild(this.engineService.sceneService.renderer.domElement);
    let width = 200;

    // ground
    let mesh = new Mesh(
      new PlaneGeometry(width, width),
      new MeshPhongMaterial({ color: 0xf58426, depthWrite: true, opacity: 1 })
    );

    mesh.rotation.x = -Math.PI / 2;
    mesh.translateX(-width / 2);
    mesh.translateY(width / 2);
    // mesh.translateZ(width / 2);
    mesh.receiveShadow = true;
    this.engineService.sceneService.scene.add(mesh);

    //TODO: вынести функцию в утилиты
    let size = 180,
      divisions = 36,
      deviation = 10,
      cell = size / divisions;

    for (let i = 0; i < divisions; i++) {
      for (let j = 0; j < divisions; j++) {
        // ground
        let mesh = new Mesh(
          new PlaneGeometry(cell, cell),
          new MeshPhongMaterial({
            color: (i * cell + j) % 2 ? 0xffffff : 0x000000,
            depthWrite: true,
            opacity: 1
          })
        );

        mesh.rotation.x = -Math.PI / 2;
        mesh.translateX(-(deviation + cell * i));
        mesh.translateY(deviation + cell * j);
        mesh.translateZ(1);

        // mesh.translateX(size/divisions);
        this.engineService.sceneService.scene.add(mesh);
      }
    }

    /**
     * Start working on MouseEvents for SelectBox
     */
    // this.storageService.hotkeySceneCommandPush(MouseCommandsEnum.mouseDown, {
    //   type: Types.Camera,
    //   onMouseDown: (event: MouseEvent) => {
    //     console.log('mousedown');
    //     this.selectionBox.startPoint.set(
    //       (event.clientX / window.innerWidth) * 2 - 1,
    //       -(event.clientY / window.innerHeight) * 2 + 1,
    //       0.5
    //     );
    //   },
    //   pressed: true,
    //   name: 'mousedown',
    //   keyCode: [0]
    // });
    //
    // this.storageService.hotkeySceneCommandPush(MouseCommandsEnum.mouseUp, {
    //   type: Types.Camera,
    //   onMouseUp: (event: MouseEvent) => {
    //     console.log('mouseup');
    //     this.selectionBox.endPoint.set(
    //       (event.clientX / window.innerWidth) * 2 - 1,
    //       -(event.clientY / window.innerHeight) * 2 + 1,
    //       0.5
    //     );
    //     let allSelected = this.selectionBox.select();
    //     for (let i = 0; i < allSelected.length; i++) {
    //       allSelected[i].material.emissive = new Color(0x0000ff);
    //     }
    //   },
    //   pressed: false,
    //   name: 'mouseup',
    //   keyCode: [0]
    // });
    //
    // this.storageService.hotkeySceneCommandPush(MouseCommandsEnum.onMouseMove, {
    //   type: Types.Camera,
    //   onMouseMove: (event: MouseEvent) => {
    //     // console.log(this.helper);
    //     // console.log('mousemove');
    //     if (this.helper.isDown) {
    //       for (let i = 0; i < this.selectionBox.collection.length; i++) {
    //         this.selectionBox.collection[i].material.emissive = new Color(0x000000);
    //       }
    //       this.selectionBox.endPoint.set(
    //         (event.clientX / window.innerWidth) * 2 - 1,
    //         -(event.clientY / window.innerHeight) * 2 + 1,
    //         0.5
    //       );
    //       let allSelected = this.selectionBox.select();
    //       for (let i = 0; i < allSelected.length; i++) {
    //         allSelected[i].material.emissive = new Color(0x0000ff);
    //       }
    //     }
    //   },
    //   pressed: true,
    //   keyCode: [NaN],
    //   name: 'mousemove'
    // });

    // grid.material.opacity = 0.2;
    // grid.material.transparent = true;
    // this.engineService.sceneService.scene.add(grid);
    this.engineService.sceneService.scene.background = new Color(0x000);

    // let camera = new PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 20000 );
    // camera.position.y = getY( worldHalfWidth, worldHalfDepth ) * 100 + 100;
    // new FirstPersonControls(camera, this.engineService.sceneService.renderer.domElement)

    this.keyboardEventService.engineService = this.engineService;

    Lightning.addLightning(
      this.engineService.sceneService.scene,
      this.engineService.sceneService.renderer,
      this.engineService.cameraService.camera,
      this.storageService
    );

    let hemisphereLightOptions = {
      color: '#ffffff',
      groundColor: '#444444',
      intensity: 0.4,
      distance: 200,
      exponent: 0,
      angle: 0.52,
      decay: 2,
      position: {
        x: 50,
        y: 300,
        z: 50
      }
    };

    let pointLightOptions = {
      color: '#89ff90',
      groundColor: '#444444',
      intensity: 0.001,
      distance: 1,
      exponent: 0,
      angle: 0.52,
      decay: 1,
      position: {
        x: 0,
        y: 40,
        z: 0
      }
    };

    let ambientLightOptions = {
      color: '#dc8874',
      groundColor: '#444444',
      intensity: 0.5,
      distance: 200,
      exponent: 0,
      angle: 0.52,
      decay: 2,
      position: {
        x: 200,
        y: 200,
        z: 200
      }
    };

    let directionalLightOptions = {
      color: '0xffffff',
      groundColor: '#fff',
      intensity: 1,
      distance: 200,
      exponent: 0,
      angle: 1.52,
      decay: 2,
      position: {
        x: 0,
        y: 200,
        z: 100
      },
      shadow: {
        castShadow: true,
        camera: {
          left: -4000,
          right: 4000,
          top: 4000,
          bottom: -4000,
          near: 0.5,
          far: 1000
        }
      }
    };

    let spotLightOptions = {
      color: '0xffffff',
      groundColor: '#fff',
      intensity: 3,
      distance: 1500,
      exponent: 0,
      angle: 1.52,
      decay: 2,
      position: {
        x: 0,
        y: 1000,
        z: -800
      }
    };

    let spotLightOptions2 = {
      color: '0x777',
      groundColor: '#777',
      intensity: 1,
      distance: 1000,
      exponent: 1,
      angle: Math.PI / 4,
      decay: 2,
      position: {
        x: 0,
        y: 50,
        z: 0
      }
    };

    this.engineService.sceneService.camera.position.set(-100, 100, 100);
    this.engineService.sceneService.camera.lookAt(-100, 0, 0);

    let geometry = new BoxGeometry(10, 10, 10);
    let material = new MeshBasicMaterial({ color: 0x00ff00 });
    let cube = new Mesh(geometry, material);
    cube.position = new Vector3(0, 0, 0);
    this.sceneService.scene.add(cube);

    // this.lightService.addLight(hemisphereLightOptions, 'HemisphereLight');

    // this.lightService.addLight(pointLightOptions, "PointLight");

    // this.lightService.addLight(ambientLightOptions, 'AmbientLight');

    // this.lightService.addLight(directionalLightOptions, 'DirectionalLight');

    // this.lightService.addLight(spotLightOptions, 'SpotLight');
    // this.lightService.addLight(spotLightOptions2, 'SpotLight');

    // let composer = new EffectComposer(this.engineService.sceneService.renderer);
    // console.log(composer);

    // let ochenEbaniiTest: HTMLImageElement = document.createElement("img");
    // ochenEbaniiTest.src = require("tests/assets/colormap/ColorMap-2.png");
    //
    // let ochenEbaniiTest2: HTMLImageElement = document.createElement("img");
    // ochenEbaniiTest.src = require("tests/assets/colormap/heightArena.png");
    //
    //
    // this.heightMapService.changeColorMapFromImage({}, this.engineService.scene, ochenEbaniiTest);
    // this.heightMapService.changeMapFromImage({}, this.engineService.scene, ochenEbaniiTest2); mn 3
  }
}
