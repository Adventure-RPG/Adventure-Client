import { Component, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Color, Group, Mesh, MeshPhongMaterial, PlaneGeometry } from 'three';
import { KeyboardEventService } from '@events/keyboard-event.service';
import { LightService } from '@modules/engine/core/light.service';
import { EngineService } from '@modules/engine/engine.service';
import { SettingsService } from '@services/settings.service';
import { StorageService } from '@services/storage.service';
// import { SelectionBox } from 'three/sources/interactive/SelectionBox';
// import { SelectionHelper } from 'three/sources/interactive/SelectionHelper';
import { Lightning } from '@modules/engine/core/utils/lightning';
import { EnumHelpers } from "@enums/enum-helpers";

export enum ArenaPanel {
  ModelLoader,
  Spell,
  Layers,
  Save,
  Load,
}

@Component({
  selector: 'adventure-arena',
  templateUrl: './arena.component.html',
  styleUrls: ['./arena.component.scss'],
})
export class ArenaComponent implements OnInit, OnDestroy {
  @ViewChild('scene', {static: true}) scene;

  sceneService;
  camera;
  renderer;
  selectionBox;
  helper;

  events = {
    mouseEvents: {
      mousedown: false,
      mouseup: true,
      mousemove: false,
      click: false,
      dbclick: false,
      mouseover: false,
      mouseout: false,
      mouseenter: false,
      mouseleave: false,
      contextmenu: false,
      mousewheel: false
    },
    keyboardEvents: {
      keydown: false,
      keyup: true
    },
    resize: true
  };

  constructor(
    private engineService: EngineService,
    private lightService: LightService,
    private settingsService: SettingsService,
    public keyboardEventService: KeyboardEventService,
    private storageService: StorageService,
    private zone: NgZone
  ) {}

  panels = (() => {

    let nodes: {
      name: string,
      value: number,
      active?: boolean,
      disabled?: false
    }[] = EnumHelpers.getNamesAndValues(ArenaPanel);

    let activePanelIndex = JSON.parse(localStorage.getItem('activePanelIndex')) || [];


    nodes.forEach((item, index) => {
      item.active = false;
      item.disabled = false;
      if (activePanelIndex.indexOf(index) !== -1){
        item.active = true;
      }
    });

    console.log(nodes);

    return nodes;
  })();

  panelChanged = (panel, event: boolean) => {

    panel.active = event;

    let activePanelIndex = [];

    this.panels.forEach((item) => {
      if (item.active){
        activePanelIndex.push(item.value)
      }
    });

    localStorage.setItem('activePanelIndex', `[${activePanelIndex.toString()}]`);
  };

  ngOnInit() {
    this.engineService.init(this.scene.nativeElement.getBoundingClientRect().width, this.scene.nativeElement.getBoundingClientRect().height);
    console.log(this.scene.nativeElement.getBoundingClientRect());

    //TODO: подумать над тем как решить трабл
    // this.selectionBox = new SelectionBox(
    //   <Camera>this.engineService.sceneService.camera,
    //   this.engineService.sceneService.scene
    // );
    // this.helper = new SelectionHelper(
    //   this.selectionBox,
    //   this.engineService.sceneService.renderer,
    //   'selectBox'
    // );

    this.settingsService.settings$.subscribe(() => {
      this.engineService.updateCamera();
    });

    this.scene.nativeElement.appendChild(this.engineService.sceneService.renderer.domElement);
    let width = 200;

    // ground
    let mesh = new Mesh(
      new PlaneGeometry(width, width),
      new MeshPhongMaterial({ color: 0xf58426, depthWrite: true, opacity: 1 })
    );

    mesh.rotation.x = -Math.PI / 2;
    mesh.translateX(width / 2);
    mesh.translateY(-width / 2);
    // mesh.translateZ(width / 2);

    mesh.receiveShadow = true;
    this.engineService.sceneService.scene.add(mesh);

    //TODO: вынести функцию в утилиты
    let size = 180,
      divisions = 36,
      deviation = 10,
      cell = size / divisions,
      group = new Group();

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
        mesh.translateX((deviation + cell * i));
        mesh.translateY(-(deviation + cell * j));
        mesh.translateZ(1);

        group.add(mesh);

        // mesh.translateX(size/divisions);
      }
    }

    this.engineService.sceneService.scene.add(group);

    /**
     * Start working on MouseEvents for SelectBox
     * TODO: вынести в директиву SelectionBox. Передавать сдвиг по необходимости
     */
    // this.storageService.hotkeySceneCommandPush(MouseCommandsEnum.mouseDown, {
    //   type: Types.Camera,
    //   onMouseDown: (event: MouseEvent) => {
    //     console.log('mousedown');
    //     this.selectionBox.startPoint.set(
    //       ((event.clientX - 400)/ this.scene.nativeElement.getBoundingClientRect().width) * 2 - 1,
    //       -(event.clientY / this.scene.nativeElement.getBoundingClientRect().height) * 2 + 1,
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
    //       ((event.clientX - 400) / this.scene.nativeElement.getBoundingClientRect().width) * 2 - 1,
    //       -(event.clientY / this.scene.nativeElement.getBoundingClientRect().height) * 2 + 1,
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

    // this.zone.runOutsideAngular(() => {
    //
    //   let throttled = (delay, fn) => {
    //     let lastCall = 0;
    //     return function (...args) {
    //       const now = (new Date).getTime();
    //       if (now - lastCall < delay) {
    //         return;
    //       }
    //       lastCall = now;
    //       return fn(...args);
    //     }
    //   };
    //
    //   let mouseMoveHandler = (event) => {
    //     console.log(event);
    //     if (this.helper.isDown) {
    //       for (let i = 0; i < this.selectionBox.collection.length; i++) {
    //         this.selectionBox.collection[i].material.emissive = new Color(0x000000);
    //       }
    //       this.selectionBox.endPoint.set(
    //         ((event.clientX - 400) / this.scene.nativeElement.getBoundingClientRect().width) * 2 - 1,
    //         -(event.clientY / this.scene.nativeElement.getBoundingClientRect().height) * 2 + 1,
    //         0.5
    //       );
    //       let allSelected = this.selectionBox.select();
    //       for (let i = 0; i < allSelected.length; i++) {
    //         allSelected[i].material.emissive = new Color(0x0000ff);
    //       }
    //     }
    //   };
    //
    //   const tHandler = throttled(200, mouseMoveHandler);
    //   window.addEventListener("mousemove", tHandler);
    //
    //
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

    this.engineService.sceneService.camera.position.set(100, 100, 100);
    this.engineService.sceneService.camera.lookAt(100, 0, 0);

    this.lightService.addLight(hemisphereLightOptions, 'HemisphereLight');

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


  ngOnDestroy() {
  }
}
