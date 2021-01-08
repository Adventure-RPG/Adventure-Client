import { AfterViewInit, Component, HostListener, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  BoxGeometry, BoxHelper, Color, Group, Mesh, MeshBasicMaterial, MeshPhongMaterial, PlaneGeometry, Vector3, LineBasicMaterial, BufferGeometry, Line, AmbientLight, DirectionalLight, HemisphereLight, Object3D
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
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

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
    // Lightning.addLightning(
    //   this.engineService.sceneService.scene,
    //   this.engineService.sceneService.renderer,
    //   this.engineService.cameraService.camera,
    //   this.storageService
    // );

    this.engineService.sceneService.camera.position.set(100, 100, 100);
    this.engineService.cameraService.updateCamera();



    const hemiLight = new HemisphereLight( '#fdfbd3', '', 0.5 );
    // hemiLight.color.setHSL( 0.6, 0.75, 0.5 );
    // hemiLight.groundColor.setHSL( 0.095, 0.5, 0.5 );
    hemiLight.position.set( 1, 1, -0.5 );    // // hemiLight.color.setHSL( 0.6, 1, 0.6 );
    // // hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
    // hemiLight.position.set( 0, 50, 0 );
    this.engineService.sceneService.scene.add( hemiLight );


    const dirLight2 = new DirectionalLight( '#fdfbd3', 1);
    dirLight2.castShadow = true;
    dirLight2.position.set( 1, 0.5, 1);
    dirLight2.position.multiplyScalar( 50 );
    this.engineService.sceneService.scene.add( dirLight2 );

    // const dirLight2 = new DirectionalLight( '#ffffff', 0.7 );
    // dirLight2.position.set( 1, 0.5, 0.75 );
    // dirLight2.position.multiplyScalar( 50 );
    // this.engineService.sceneService.scene.add( dirLight2 );

    // @ts-ignore
    // const [x1, y1] = this.data.features[5].geometry.coordinates;
    // @ts-ignore
    // const [x2, y2] = this.data.features[6].geometry.coordinates;

    // const R = Math.sqrt((Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)) / 3);
    const loader = new GLTFLoader();

    //TODO: check dracoloader
    // const dracoLoader = new DRACOLoader();
    // dracoLoader.setDecoderPath( 'three/examples/js/libs/draco/' );
    // loader.setDRACOLoader( dracoLoader );
    // Load a glTF resource
    loader.load(
      // resource URL
      '/assets/models/tree/Trees_Flowers_and_Rocks.glb',
      // called when the resource is loaded
      ( gltf ) => {

        const models: Object3D[] = gltf.scene.children.filter(mesh => mesh.name.includes('Tree'));
        console.log(gltf)


        const R = 4.90;
        // console.log(Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)));
        let board = new Board(this.data.features, R, models);
        // console.log(board);
        this.engineService.sceneService.scene.add( board );

      },
      // called while loading is progressing
      ( xhr ) => {

        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

      },
      // called when loading has errors
      ( error ) => {

        console.log(error);
        console.log( 'An error happened' );

      }
    );
    // const light = new AmbientLight( 0x404040 ); // soft white light
    // this.engineService.sceneService.scene.add(light);
  }


  ngOnDestroy() {
    this.resizeSubscription$.unsubscribe();
  }
}
