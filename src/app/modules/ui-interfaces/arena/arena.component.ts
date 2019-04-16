import { Component, OnInit, ViewChild } from '@angular/core';
import { Color, EffectComposer, GridHelper, Mesh, MeshPhongMaterial, PlaneGeometry } from 'three';
import { KeyboardEventService } from '@events/keyboard-event.service';
import { LightService } from '@modules/engine/core/light.service';
import { EngineService } from '@modules/engine/engine.service';
import { SettingsService } from '@services/settings.service';
import 'three/examples/js/shaders/CopyShader';
import 'three/examples/js/shaders/FXAAShader';
import 'three/examples/js/postprocessing/EffectComposer';
import 'three/examples/js/postprocessing/RenderPass';
import 'three/examples/js/postprocessing/ShaderPass';
import 'three/examples/js/postprocessing/OutlinePass';
import { StorageService } from '@services/storage.service';
import { MouseCommandsEnum } from '@enums/mouseCommands.enum';
import { Types } from '@enums/types.enum';
import 'three/examples/js/interactive/SelectionBox';
import 'three/examples/js/interactive/SelectionHelper';
import * as THREE from 'three';

@Component({
  selector: 'adventure-arena',
  templateUrl: './arena.component.html',
  styleUrls: ['./arena.component.scss']
})
export class ArenaComponent implements OnInit {
  @ViewChild('scene') scene;

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
  ) {
    console.log('adada');
    console.log(THREE.SelectionBox);
    console.log(new THREE());
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
  // this.engineService.renderEngine();

  ngOnInit() {
    this.settingsService.settings$.subscribe(() => {
      this.engineService.updateCamera();
    });
    console.log('init');
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

    // grid.material.opacity = 0.2;
    // grid.material.transparent = true;
    // this.engineService.sceneService.scene.add(grid);
    this.engineService.sceneService.scene.background = new Color(0xa0a0a0);

    // let camera = new PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 20000 );
    // camera.position.y = getY( worldHalfWidth, worldHalfDepth ) * 100 + 100;
    // new FirstPersonControls(camera, this.engineService.sceneService.renderer.domElement)

    this.keyboardEventService.engineService = this.engineService;

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
      intensity: 1,
      distance: 250,
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

    this.lightService.addLight(hemisphereLightOptions, 'HemisphereLight');

    // this.lightService.addLight(pointLightOptions, "PointLight");

    // this.lightService.addLight(ambientLightOptions, 'AmbientLight');

    // this.lightService.addLight(directionalLightOptions, 'DirectionalLight');

    this.lightService.addLight(spotLightOptions, 'SpotLight');
    // this.lightService.addLight(spotLightOptions2, 'SpotLight');

    let composer = new THREE.EffectComposer(this.engineService.sceneService.renderer);
    console.log(composer);

    // let ochenEbaniiTest: HTMLImageElement = document.createElement("img");
    // ochenEbaniiTest.src = require("tests/assets/colormap/ColorMap-2.png");
    //
    // let ochenEbaniiTest2: HTMLImageElement = document.createElement("img");
    // ochenEbaniiTest.src = require("tests/assets/colormap/heightArena.png");
    //
    //
    // this.heightMapService.changeColorMapFromImage({}, this.engineService.scene, ochenEbaniiTest);
    // this.heightMapService.changeMapFromImage({}, this.engineService.scene, ochenEbaniiTest2); mn 3w
  }
}
