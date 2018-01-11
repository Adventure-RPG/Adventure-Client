import { Injectable } from '@angular/core';
import * as THREE from 'three';
import {HeightMapOptions} from "./engine.types";


import {HeightMapService} from "./core/3d-helpers/height-map.service";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {SceneService} from './core/base/scene.service';
import {CameraService} from './core/base/camera.service';
import {SettingsService} from '../../services/settings.service';

declare let require: any;

@Injectable()
export class EngineService {

  constructor(
    private _heightMapService: HeightMapService,
    private _sceneService: SceneService,
    private _cameraService: CameraService
  ) {}

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

  //TODO: add retina pixelRatio
  public resize(gl) {
    console.log(gl)
    let realToCSSPixels = window.devicePixelRatio;

    // Lookup the size the browser is displaying the canvas in CSS pixels
    // and compute a size needed to make our drawingbuffer match it in
    // device pixels.
    let displayWidth  = Math.floor(gl.canvas.clientWidth  * realToCSSPixels);
    let displayHeight = Math.floor(gl.canvas.clientHeight * realToCSSPixels);

    // Check if the canvas is not the same size.
    if (gl.canvas.width  !== displayWidth ||
      gl.canvas.height !== displayHeight) {

      // Make the canvas the same size
      gl.canvas.width  = displayWidth;
      gl.canvas.height = displayHeight;
    }
  }

  public init() {
    // Scene
    // let d = this.settings.camera.d;
    this.sceneService.scene = new THREE.Scene();

    let axisHelper = new THREE.AxisHelper( 5 );
    this.sceneService.scene.add( axisHelper );

    console.log(this.sceneService.scene)

    this.updateCamera();

  }

  public updateCamera(){
    console.log(this.sceneService.scene);
    this.cameraService.updateCamera(this.sceneService.scene.position);
    this.sceneService.animation(this.cameraService.camera);
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
