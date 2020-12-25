import { AfterViewInit, Component, HostListener, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  BoxGeometry, BoxHelper, Color, Group, Mesh, MeshBasicMaterial, MeshPhongMaterial, PlaneGeometry, Vector3, LineBasicMaterial, BufferGeometry, Line, AmbientLight, DirectionalLight, HemisphereLight
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

    // group = ObjectCreater.createHeroes({count: 6, storageService: this.storageService ,callback: (heroes) =>{
    //     console.log(heroes)
    //     // helper.update();
    //     // let object = new Mesh( heroes, new MeshBasicMaterial( {color: 0xff0000 }) );
    //     // let box = new BoxHelper( object, 0xff0000 );
    //     this.engineService.sceneService.scene.add( heroes );
    //     // this.engineService.sceneService.scene.add( box );
    //     // this.engineService.sceneService.scene.add(heroes);
    //   }
    // });

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
      groundColor: '',
      intensity: 0.7,
      position: {
        x: 0,
        y: 50,
        z: 0
      }
    };

    let hemisphereLightOptions2 = {
      color: '#ffffff',
      groundColor: '#880000',
      intensity: 0.5,
      position: {
        x: 300,
        y: -800,
        z: 300
      }
    };

    let pointLightOptions = {
      color: '#abde7e',
      groundColor: '#4ec37d',
      intensity: 0.5,
      distance: 5000,
      exponent: 0,
      angle: 0.52,
      decay: 1,
      position: {
        x: 0,
        y: 100,
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

    // this.lightService.addLight(hemisphereLightOptions, 'HemisphereLight');
    // this.lightService.addLight(hemisphereLightOptions2, 'HemisphereLight');

    // this.lightService.addLight(pointLightOptions, "PointLight");

    // this.lightService.addLight(ambientLightOptions, 'AmbientLight');



    const hemiLight = new HemisphereLight( 0xffffff, 0xffffff, 0.6 );
    hemiLight.color.setHSL( 0.6, 0.75, 0.5 );
    hemiLight.groundColor.setHSL( 0.095, 0.5, 0.5 );
    hemiLight.position.set( 0, 500, 0 );    // // hemiLight.color.setHSL( 0.6, 1, 0.6 );
    // // hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
    // hemiLight.position.set( 0, 50, 0 );
    // this.engineService.sceneService.scene.add( hemiLight );


    const dirLight = new DirectionalLight( '#ffffff', 1 );
    dirLight.position.set( -1, 0.75, 1 );
    dirLight.position.multiplyScalar( 50 );
    this.engineService.sceneService.scene.add( dirLight );


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


    // @ts-ignore
    // const [x1, y1] = this.data.features[5].geometry.coordinates;
    // @ts-ignore
    // const [x2, y2] = this.data.features[6].geometry.coordinates;

    // const R = Math.sqrt((Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)) / 3);

    const R = 4.95;

    // console.log(Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)));
    let board = new Board(this.data.features, R);
    // console.log(board);
    this.engineService.sceneService.scene.add(board);
    // const light = new AmbientLight( 0x404040 ); // soft white light
    // this.engineService.sceneService.scene.add(light);
  }


  ngOnDestroy() {
    this.resizeSubscription$.unsubscribe();
  }
}
