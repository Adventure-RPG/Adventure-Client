import { Component, OnInit, ViewChild } from '@angular/core';
import { Lightning } from "@modules/engine/core/utils/lightning";
import { ObjectCreater } from "../../../utils/object-creater";
import { fromEvent } from "rxjs/index";
import { Color, Mesh, MeshBasicMaterial, Object3D, SphereGeometry } from "three";
import { debounceTime, take } from "rxjs/internal/operators";
import { EngineService } from "@modules/engine/engine.service";
import { SettingsService } from "@services/settings.service";
import { LightService } from "@modules/engine/core/light.service";
import { KeyboardEventService } from "@events/keyboard-event.service";
import { StorageService } from "@services/storage.service";
import { utils } from "protractor";
import { Utils } from "../../../utils/utils";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'adventure-map-viewer',
  templateUrl: './map-viewer.component.html',
  styleUrls: ['./map-viewer.component.scss']
})
export class MapViewerComponent implements OnInit {

  @ViewChild('scene', {static: true}) scene;

  sceneService;
  camera;
  resizeSubscription$;

  constructor(
    private engineService: EngineService,
    private settingsService: SettingsService,
    private lightService: LightService,
    public keyboardEventService: KeyboardEventService,
    private storageService: StorageService,
    private http: HttpClient
  ) { }

  ngOnInit() {
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
    // // mesh.translateZ(width / 2);
    //
    // group = ObjectCreater.createGrid({divisions, size});
    // this.engineService.sceneService.scene.add(group);
    //
    // group = ObjectCreater.createHeroes({count: 6, storageService: this.storageService ,callback: (heroes) =>{
    //     // console.log(heroes)
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


    let planet = new Object3D();
    //Create a sphere to make visualization easier.
    let geometry = new SphereGeometry(100, 32, 32);
    let material = new MeshBasicMaterial({
      color: 0x333333,
      // wireframe: true,
      transparent: true
    });
    let sphere = new Mesh(geometry, material);
    planet.add(sphere);

    let countries = new Object3D();

    //https://github.com/jdomingu/ThreeGeoJSON/blob/master/test_geojson/rivers.geojson
    this.http.get('assets/geojson/VisiaRoutes.geojson')
      .pipe(
        take(1)
      )
      .subscribe(data => {

        Utils.drawThreeGeo(
          data,
          100,
          'sphere',
          {
            color: 0x880088
          },
          countries);
        console.log(data);
      });

    this.http.get('assets/geojson/VisiaRivers.geojson')
      .pipe(
        take(1)
      )
      .subscribe(data => {

        Utils.drawThreeGeo(
          data,
          100,
          'sphere',
          {
            color: 0x888800
          },
          countries);
        console.log(data);
      });

    this.http.get('assets/geojson/VisiaCells.geojson')
      .pipe(
        take(1)
      )
      .subscribe(data => {

        Utils.drawThreeGeo(
          data,
          100,
          'sphere',
          {
            color: 0x884444
          },
          countries);
        console.log(data);
      });


    this.engineService.sceneService.scene.add(planet);
    this.engineService.sceneService.scene.add(countries);
    // grid.material.opacity = 0.2;
    // grid.material.transparent = true;
    // this.engineService.sceneService.scene.add(grid);

    this.keyboardEventService.engineService = this.engineService;

    let hemisphereLightOptions = {
      color: '#ffffff',
      groundColor: '#331608',
      intensity: 0.25,
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
      color: '#24ff5b',
      groundColor: '#444444',
      intensity: 1,
      distance: 300,
      exponent: 0,
      angle: 0.52,
      decay: 1,
      position: {
        x: 0,
        y: 20,
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
    this.engineService.cameraService.updateCamera();
    // this.engineService.cameraService.updateCamera(new Vector3(100, 100, 100), {target: new Vector3(100, 0, 0)});

    // this.lightService.addLight(hemisphereLightOptions, 'HemisphereLight');
    //
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
