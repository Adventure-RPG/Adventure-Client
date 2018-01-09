import { Injectable } from '@angular/core';
import * as THREE from 'three';
import {HeightMapOptions} from "./engine.types";


import {CubicGrid} from "./elements/cubic-grid";
import {Grid} from "./elements/grid";
import {HeightMapService} from "./height-map.service";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

declare let require: any;

@Injectable()
export class EngineService {

  constructor(
    private heightMapService: HeightMapService
  ) {}

  private _settings:any;
  public get settings():any {
    return this._settings;
  }
  public set settings(settings:any) {
    this._settings = settings;

    //Add lifycycle for camera;
    if (this.scene && settings && settings.camera && settings.camera.d) {
      this.updateCamera();
    }
  }

  public camera:THREE.Camera;
  public scene: THREE.Scene;
  public renderer: THREE.WebGLRenderer;
  public domElement;

  private _initStatus: any = new BehaviorSubject<any>(null);
  public _initStatus$ = this._initStatus.asObservable();

  public get initStatus() {
      return this._initStatus;
  }

  public set initStatus(value: any){
      this._initStatus.next(value);
  }



  // TODO: вынести в отдельный модуль
  public grid(){
      let grid = new Grid();
      grid.addGeometry(this.settings);
      this.scene.add( grid.figure );
  }

  public cubicGrid(){
      let cubicGrid = new CubicGrid();
      cubicGrid.addGeometry(this.settings);
      this.scene.add( cubicGrid.figure );
  }

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

              this.scene.add(group);

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
          // this.scene.add(mesh);

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

          this.scene.add(group);

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

  public updateCamera(x?, y?, z?){
    if (!x){ x = 0 }
    if (!y){ y = 0 }
    if (!z){ z = 0 }
    let aspect = window.innerWidth / window.innerHeight;
    let d = this.settings.camera.d;
    this.camera = new THREE.OrthographicCamera( - d * aspect, d * aspect, d, - d, 1, d * 40 );
    this.camera.position.set( d * 8, d * 8, d * 8); // all components equal
    this.camera.lookAt( this.scene.position ); // or the origin
    console.log(this.camera);

   // test only
    // this.renderer.render(this.scene, this.camera);

  }


  public init(){
    //Scene
    // let d = this.settings.camera.d;
    this.scene = new THREE.Scene();
    this.updateCamera();
    // this.lightInit(d);



    let axisHelper = new THREE.AxisHelper( 5 );
    this.scene.add( axisHelper );

    //Render
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize( window.innerWidth, window.innerHeight ) ;

    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap; // default THREE.PCFShadowMap
    // this.renderer.shadowMap.renderSingleSided  = true;
    // this.renderer.shadowMap.renderReverseSided = false;

    this.domElement = this.renderer.domElement;
    this.modelObservable();
  }



  public map(img){
    let options:HeightMapOptions = {
      grid: true
    };

    console.log(this.scene);

    this.heightMapService.changeMapFromImage(options, this.scene, img);
  }

  public colorMap(img){
    let options:HeightMapOptions = {
      grid: false
    };

    console.log(this.scene);

    this.heightMapService.changeColorMapFromImage(options, this.scene, img);
  }

  public modelObservable(){
    // this.cubicGrid();
    // this.testObj();
    this.initStatus = true;
    this.animation();
  }

  //Render logic
  public animation(){
    function callbackAnimation(context){
      context.animation();
    }

    window.requestAnimationFrame(callbackAnimation.bind(null, this));
    this.renderer.render( this.scene, this.camera);
  }
}
