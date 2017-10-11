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

  /**
   * Метод загрузки FBX модели
   * @param url
   */
  public loadFBX(url){

    //Инцилизация модуля.
    require('three-fbx-loader')(THREE);

    let loader = new THREE.FBXLoader();

    loader.load(
      url,
      (geometry: any) => {
        let material = new THREE.MeshNormalMaterial();
        let mesh = new THREE.Mesh(geometry, material);
        console.log(mesh)
        this.scene.add(mesh);
      },
      (event) => {
        console.log(event)
      },
      (event) => {
        console.error(event)
      }
    );
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
  }

  public lightInit(d){

    //TODO: вынести свет в отдельную категорию.
    // light
    // let light:THREE.HemisphereLight = new THREE.HemisphereLight( 0xffffff, 0x000000, 1 );
    // light.position.set(- d * 10, d * 2, d * 2 );
    // this.scene.add( light );

    // console.log(light);
    let dirLight, dirLightHelper,
        lightLength = 50;



    dirLight = new THREE.DirectionalLight( 0xffffff,  0.6  );
    dirLight.color.setHSL( 0.1, 1, 0.95 );
    dirLight.position.set( -lightLength, lightLength, lightLength );
    dirLight.shadow.bias = 0.0001;
    //HELPLER
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width  = 50;
    dirLight.shadow.mapSize.height = 50;

    // dirLight.shadow.camera.left   = -d;
    // dirLight.shadow.camera.right  =  d;
    // dirLight.shadow.camera.top    =  d;
    // dirLight.shadow.camera.bottom = -d;
    //
    // dirLight.shadow.camera.far = 5;
    this.scene.add( dirLight );

    dirLightHelper = new THREE.DirectionalLightHelper( dirLight, lightLength );
    this.scene.add( dirLightHelper );




    // // spotlight #1 -- yellow, dark shadow
    // let spotLight = new THREE.SpotLight(0xffff00);
    // spotLight.position.set(30,35,-60);
    // spotLight.shadow.camera.visible = true;
    // // spotlight.shadowDarkness = 0.95;
    // spotLight.intensity = 1;
    // // must enable shadow casting ability for the light
    // spotLight.castShadow = true;
    // this.scene.add(spotLight);
    //
    // new THREE.AxisHelper( 100 );
    // let spotLightHelper = new THREE.SpotLightHelper( spotLight );
    // this.scene.add( spotLightHelper );
  }

  public init(){
    //Scene
    let d = this.settings.camera.d;
    this.scene = new THREE.Scene();
    this.updateCamera();
    this.lightInit(d);



    let axisHelper = new THREE.AxisHelper( 5 );
    this.scene.add( axisHelper );

    //Render
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize( window.innerWidth, window.innerHeight ) ;

    this.renderer.shadowMap.enabled = true;
    // this.renderer.shadowMap.renderSingleSided  = false;
    // this.renderer.shadowMap.renderReverseSided = false;

    this.domElement = this.renderer.domElement;
    this.modelObservable();
  }



  public map(img){
    let options:HeightMapOptions = {
      color: "rgba(255,255,255, 0.3)",
      grid: false
    };

    console.log(this.scene);

    this.heightMapService.changeMapFromImage(options, this.scene, img);
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
