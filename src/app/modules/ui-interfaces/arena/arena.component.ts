import { AfterViewInit, Component, HostListener, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  BoxGeometry, BoxHelper, Color, Group, Mesh, MeshBasicMaterial, MeshPhongMaterial, PlaneGeometry, Vector3, LineBasicMaterial, BufferGeometry, Line
} from 'three';
import { KeyboardEventService } from '@events/keyboard-event.service';
import { LightService } from '@modules/engine/core/light.service';
import { EngineService } from '@modules/engine/engine.service';
import { SettingsService } from '@services/settings.service';
import { StorageService } from '@services/storage.service';
// import { SelectionBox } from 'three/sources/interactive/SelectionBox';
// import { SelectionHelper } from 'three/sources/interactive/SelectionHelper';
import { Lightning } from '@modules/engine/core/utils/lightning';
import { EnumHelpers } from "@enums/enum-helpers";
import { CAMERA } from "@enums/settings.enum";
import { fromEvent, Observable } from "rxjs/index";
import { debounceTime, tap } from "rxjs/internal/operators";
import { ObjectCreater } from "../../../utils/object-creater";
import { Board } from "../../../utils/board";
import { ModelLoaderService } from "@modules/engine/core/base/model-loader.service";
import { GeoJSON } from "../../../../typings";

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
export class ArenaComponent implements OnDestroy, AfterViewInit {
  @ViewChild('scene') scene;

  sceneService;
  camera;
  renderer;
  selectionBox;
  helper;
  resizeSubscription$;

  data: GeoJSON = require('../../../../../src/tests/world.json');

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
    resize: false
  };

  constructor(
    private engineService: EngineService,
    private lightService: LightService,
    private settingsService: SettingsService,
    public keyboardEventService: KeyboardEventService,
    private storageService: StorageService,
    private modelLoaderService: ModelLoaderService,
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

  chooseCamera(camera){
    this.settingsService.changeSetting('camera', { type: camera });
    // console.log(this.engineService.cameraService.cameries);
    // console.log(this.engineService.cameraService.cameries[camera]);
  }

  ngAfterViewInit() {
    // console.log(this.scene);
    this.engineService.init(this.scene.nativeElement.getBoundingClientRect().width, this.scene.nativeElement.getBoundingClientRect().height);

    this.resizeSubscription$ = fromEvent(window, 'resize')
      .pipe(
        debounceTime(250)
      )
      .subscribe( evt => {
        setTimeout(() => {
          this.settingsService.changeSetting('camera', { type: this.settingsService.settings.camera.type });
        }, 0);
      });



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

    //TODO: вынести функцию в утилиты
    let size = 360,
      divisions = 72,
      group,
      borderWidth = 20,
      borderHeight = 4;

    // group = ObjectCreater.createBorder({borderWidth, size, borderHeight});
    // this.engineService.sceneService.scene.add(group);
    // mesh.translateZ(width / 2);


    // @ts-ignore
    // const [x1, y1] = this.data.features[5].geometry.coordinates;
    // @ts-ignore
    // const [x2, y2] = this.data.features[6].geometry.coordinates;

    // const R = Math.sqrt((Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)) / 3);

    const R = 0.48;

    // console.log(Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)));
    let board = new Board(this.data.features, R);
    // console.log(board);
    this.engineService.sceneService.scene.add(board);

    // group = ObjectCreater.createGrid({divisions, size});
    // this.engineService.sceneService.scene.add(group);

    // const material = new LineBasicMaterial( { color: 0xffffff } );
    // for (let i = 0; i < this.data.features.length; i++) {
    //   let feature = this.data.features[i];
    //   const points = [];
    //
    //   //feature.properties.height
    //   for (let j = 0; j < feature.geometry.coordinates[0].length; j++) {
    //     let bone = feature.geometry.coordinates[0][j];
    //     points.push( new Vector3( (bone[1] - 30.5 ) * 5000 , 0 , ( bone[0] + 68.2 ) * 5000 ) );
    //   }
    //
    //   const geometry = new BufferGeometry().setFromPoints( points );
    //
    //   const line = new Line( geometry, material );
    //   // console.log(points);
    //   this.engineService.sceneService.scene.add( line );
    // }
    // const material2 = new LineBasicMaterial({
    //   color: 0x0000ff
    // });
    //
    // const points = [];
    // // points.push( new Vector3( -21.83, 48.8, 0 ) );
    // points.push( new Vector3( 0, 10, 0 ) );
    // points.push( new Vector3( 10, 0, 0 ) );
    // points.push( new Vector3( 14, 2, 0 ) );
    // points.push( new Vector3( 16, 0, 0 ) );
    //
    // const geometry = new BufferGeometry().setFromPoints( points );
    //
    // const line = new Line( geometry, material2 );
    // this.engineService.sceneService.scene.add( line )

    // group = ObjectCreater.createHeroes({count: 6, storageService: this.storageService ,callback: (heroes) =>{
    //     console.log(heroes)
    //     //
    //     //
    //     // helper.update();
    //     // let object = new Mesh( heroes, new MeshBasicMaterial( {color: 0xff0000 }) );
    //     // let box = new BoxHelper( object, 0xff0000 );
    //     this.engineService.sceneService.scene.add( heroes );
    //     // this.engineService.sceneService.scene.add( box );
    //
    //     // this.engineService.sceneService.scene.add(heroes);
    //   }
    // });

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
    this.engineService.sceneService.scene.background = new Color(0x444);

    this.keyboardEventService.engineService = this.engineService;

    //TODO: Отрефакторить.
    Lightning.addLightning(
      this.engineService.sceneService.scene,
      this.engineService.sceneService.renderer,
      this.engineService.cameraService.camera,
      this.storageService
    );

    let hemisphereLightOptions = {
      color: '#ffffff',
      groundColor: '#331608',
      intensity: 0.25,
      distance: 1000,
      exponent: 0,
      angle: 0.52,
      decay: 2,
      position: {
        x: 50,
        y: 800,
        z: 50
      }
    };

    let pointLightOptions = {
      color: '#24ff5b',
      groundColor: '#444444',
      intensity: 1,
      distance: 2000,
      exponent: 0,
      angle: 0.52,
      decay: 1,
      position: {
        x: 300,
        y: 1000,
        z: 300
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
    this.engineService.cameraService.updateCamera();
    // this.engineService.cameraService.updateCamera(new Vector3(100, 100, 100), {target: new Vector3(100, 0, 0)});

    this.lightService.addLight(hemisphereLightOptions, 'HemisphereLight');

    this.lightService.addLight(pointLightOptions, "PointLight");

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
    this.resizeSubscription$.unsubscribe();
  }
}
