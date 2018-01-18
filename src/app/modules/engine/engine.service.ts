import {Injectable, OnInit} from '@angular/core';
import * as THREE from 'three';
import {HeightMapOptions} from "./engine.types";


import {HeightMapService} from "./core/3d-helpers/height-map.service";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {SceneService} from './core/base/scene.service';
import {CameraService} from './core/base/camera.service';
import {SettingsService} from '../../services/settings.service';
import {Geometry, SceneUtils} from 'three';

declare let require: any;

@Injectable()
export class EngineService{

  get settingsService(): SettingsService {
    return this._settingsService;
  }

  set settingsService(value: SettingsService) {
    this._settingsService = value;
  }

  get heightMapService(): HeightMapService {
    return this._heightMapService;
  }

  set heightMapService(value: HeightMapService) {
    this._heightMapService = value;
  }

  get cameraService(): CameraService {
    return this._cameraService;
  }

  set cameraService(value: CameraService) {
    this._cameraService = value;
  }

  get sceneService(): SceneService {
    return this._sceneService;
  }

  set sceneService(value: SceneService) {
    this._sceneService = value;
  }

  constructor(
    private _heightMapService: HeightMapService,
    private _sceneService: SceneService,
    private _cameraService: CameraService,
    private _settingsService: SettingsService
  ) {
    this.settingsService.settings$.subscribe(
      (data) => {
        console.log(data);
        this.cameraService.initIsometricCamera();
      }
    );
  }

  private _initStatus: any = new BehaviorSubject<any>(null);
  public _initStatus$ = this._initStatus.asObservable();

  public get initStatus() {
      return this._initStatus;
  }

  public set initStatus(value: any){
      this._initStatus.next(value);
  }



  // TODO: вынести в отдельный модуль
  //TODO: вынести аплойд файлов
  /**
   * Метод загрузки FBX модели
   * @param url
   */
  public loadFBX(model){

    // Вынести в отдельный флоу



    // let test = require('./../../libs/inflate.min');
    // console.log(test.Zlib)
    //Инцилизация модуля.
    require('three-fbx-loader')(THREE);

    let loader = new THREE.FBXLoader();

    // let texture = new THREE.TextureLoader().load("assets/models/polygon-knights/Textures/Texture_01_Swap_Snow_To_Grass.png");

    let texture;
    if (model.texturePath){
      texture = new THREE.TextureLoader().load(
        model.texturePath,
        (data) => {
          console.log(data);
          let modelLoader = loader.load(
            model.path,
            (group: THREE.Group) => {
              // let material = new THREE.MeshNormalMaterial();
              // let mesh = new THREE.Mesh(geometry, material);
              // console.log(mesh)
              // this.scene.add(mesh);

              // if you want to add your custom material
              //

              // let materialObj = new THREE.MeshPhongMaterial({
                // map: texture
              // });

              let box = new THREE.Box3().setFromObject(group);
              console.log(box.min, box.max, box.getSize() );



              group.scale.set(1 / box.getSize().x * 8, 1 / box.getSize().x  * 8, 1 / box.getSize().x  * 8);
              // group.scale.set(1, 1, 1);
              group.traverse((child: THREE.Mesh) => {
                  if (child instanceof THREE.Mesh) {

                      console.log(child);
                      (<THREE.MeshLambertMaterial>child.material).map = texture;
                      (<THREE.MeshLambertMaterial>child.material).needsUpdate = true;

                  }
              });

              this._sceneService.scene.add(group);

            },
            (event) => {
              console.log(event)
            },
            (event) => {
              console.error(event)
            }
          );
        }
      );
    } else {
      let modelLoader = loader.load(
        model.path,
        (group: THREE.Group) => {
          // let material = new THREE.MeshNormalMaterial();
          // let mesh = new THREE.Mesh(geometry, material);
          // console.log(mesh)
          // this.sceneService.scene.add(mesh);

          // if you want to add your custom material
          //

          // let materialObj = new THREE.MeshPhongMaterial({
            // map: texture
          // });

          group.scale.set(0.1, 0.1, 0.1);
          // group.traverse((child: THREE.Mesh) => {
          //     if (child instanceof THREE.Mesh) {
          //
          //       console.log(child);
          //         (<THREE.MeshLambertMaterial>child.material).map = texture;
          //         (<THREE.MeshLambertMaterial>child.material).needsUpdate = true;
          //
          //     }
          // });

          this._sceneService.scene.add(group);

        },
        (event) => {
          console.log(event)
        },
        (event) => {
          console.error(event)
        }
      );
    }

// console.log(texture);

// console.log(model)

  }

  public test(){
    let vertices = [];
    let holes = [];
    let triangles, mesh;
    let geometry = new THREE.Geometry();
    let material = new THREE.MeshPhongMaterial({ opacity: 0.5, flatShading: true });
    var verticesOfCube = [
      -1,-1,-1,    1,-1,-1,    1, 1,-1,    -1, 1,-1,
      -1,-1, 1,    1,-1, 1,    1, 1, 1,    -1, 1, 1,
    ];

    var indicesOfFaces = [
      2,1,0,    0,3,2,
      0,4,7,    7,3,0,
      0,1,5,    5,4,0,
      1,2,6,    6,5,1,
      2,3,7,    7,6,2,
      4,5,6,    6,7,4
    ];

    geometry = new THREE.PolyhedronGeometry( verticesOfCube, indicesOfFaces, 6, 2 );
    mesh = new THREE.Mesh( geometry, material );

    console.log(geometry);

    this.sceneService.scene.add(mesh);

    // let material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    // let cube = new THREE.Mesh( geometry, material );
    // console.log(cube);
    // this.sceneService.scene.add(cube);

  }



  public init() {
    // Scene
    // let d = this.settings.camera.d;

    let axisHelper = new THREE.AxisHelper( 5 );

    // Delete
    this.test();
    // End Delete

    this.sceneService.scene.add( axisHelper );

    console.log(this.sceneService.scene);

    this.updateCamera();

  }

  public updateCamera(x?, y?, z?) {
    console.log(this.sceneService.scene);
    let camera = this.cameraService.updateCamera(this.sceneService.scene.position, x, y, z);
    this.sceneService.camera = camera;
  }



  public map(img){
    let options: HeightMapOptions = {
      grid: true
    };

    console.log(this.sceneService.scene);

    this.heightMapService.changeMapFromImage(options, this.sceneService.scene, img);
  }

  public colorMap(img){
    let options: HeightMapOptions = {
      grid: false
    };

    console.log(this.sceneService.scene);

    this.heightMapService.changeColorMapFromImage(options, this.sceneService.scene, img);
  }

}
