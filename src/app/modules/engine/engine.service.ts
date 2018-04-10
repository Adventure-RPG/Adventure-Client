import {Injectable, OnInit} from '@angular/core';
import * as THREE from 'three';
import {HeightMapOptions} from "./engine.types";


import {HeightMapService} from "./core/3d-helpers/height-map.service";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {SceneService} from './core/base/scene.service';
import {CameraService} from './core/base/camera.service';
import {SettingsService} from '../../services/settings.service';
import {AxesHelper, FBXLoader, Geometry, Group, SceneUtils, TextureLoader, Vector3} from 'three';

declare let require: any;

@Injectable()
export class EngineService{

  private _x: number = 0;
  private _y: number = 0;
  private _z: number = 0;

  get x() {
    return this._x;
  }

  set x(value) {
    this._x = value;
  }

  get y() {
    return this._y;
  }

  set y(value) {
    this._y = value;
  }

  get z() {
    return this._z;
  }

  set z(value) {
    this._z = value;
  }

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
        // console.log(data);
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

    let loader = new FBXLoader();

    // let texture = new THREE.TextureLoader().load("assets/models/polygon-knights/Textures/Texture_01_Swap_Snow_To_Grass.png");

    let texture;
    if (model.texturePath){
      texture = new TextureLoader().load(
        model.texturePath,
        (data) => {
          console.log(data);
          let modelLoader = loader.load(
            model.path,
            (group: Group) => {
              // let material = new THREE.MeshNormalMaterial();
              // let mesh = new THREE.Mesh(geometry, material);
              // console.log(mesh)
              // this.scene.add(mesh);

              // if you want to add your custom material
              //

              // let materialObj = new THREE.MeshPhongMaterial({
                // map: texture
              // });

              // TODO: getSize() требует аргумент
              // let box = new THREE.Box3().setFromObject(group);
              // console.log(box.min, box.max, box.getSize() );
              //
              //
              //
              // group.scale.set(1 / box.getSize().x * 8, 1 / box.getSize().x  * 8, 1 / box.getSize().x  * 8);
              // // group.scale.set(1, 1, 1);
              // group.traverse((child: THREE.Mesh) => {
              //     if (child instanceof THREE.Mesh) {
              //
              //         console.log(child);
              //         (<THREE.MeshLambertMaterial>child.material).map = texture;
              //         (<THREE.MeshLambertMaterial>child.material).needsUpdate = true;
              //
              //     }
              // });
              //
              // this._sceneService.scene.add(group);

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
        (group: Group) => {
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


  public init() {
    // Scene
    // let d = this.settings.camera.d;

    let axesHelper = new AxesHelper( 5 );

    // Delete
    // this.test();
    // End Delete

    this.sceneService.scene.add( axesHelper );

    // console.log(this.sceneService.scene);

    this.updateCamera();

  }

  public updateCamera(x?, y?, z?) {
    // console.log(this.x);

    if (x){this.x = this.x + x;}
    if (y){this.y = this.y + y;}
    if (z){this.z = this.z + z;}
    // this.y = this.y + y;
    // this.z = this.z + z;
    // console.log(this.x);

    let camera = this.cameraService.updateCamera(new Vector3(this.x, this.y, this.z));
    this.sceneService.camera = camera;
  }



  public map(img){
    let options: HeightMapOptions = {
      grid: false
    };

    console.log(this.sceneService.scene);

    this.heightMapService.changeMapFromImage(options, this.sceneService.scene, img);
  }

  public generateFromNoise(){
    this.heightMapService.generateDungeonTerrain(this.sceneService.scene);
    // this.heightMapService.getHeightMap(this.sceneService.scene);
  }

  public colorMap(img){
    let options: HeightMapOptions = {
      grid: false
    };

    console.log(this.sceneService.scene);

    this.heightMapService.changeColorMapFromImage(options, this.sceneService.scene, img);
  }

}
