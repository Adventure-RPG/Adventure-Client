import { Injectable } from '@angular/core';
import * as THREE from 'three';
import {HeightMapOptions} from "./engine.types";


import {CubicGrid} from "./elements/cubic-grid";
import {Grid} from "./elements/grid";

@Injectable()
export class EngineService {

  constructor() {}

  private _settings:any;
  public get settings():any {
    return this._settings;
  }
  public set settings(settings:any) {
    this._settings = settings;
  }


  public camera:THREE.Camera;
  public scene;
  public renderer;
  public domElement;


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

  public init(){

    //Scene
    this.scene = new THREE.Scene();

    //Camera
    let aspect = window.innerWidth / window.innerHeight;
    let d = this._settings.camera.d;
    this.camera = new THREE.OrthographicCamera( - d * aspect, d * aspect, d, - d, 1, 1000 );
    this.camera.position.set( d * 8, d * 8, d * 8 ); // all components equal
    this.camera.lookAt( this.scene.position ); // or the origin

    // light
    let light:THREE.HemisphereLight = new THREE.HemisphereLight( 0x0000ff, 0x00ff00, 0.6 );
    light.position.set(-d * 10, d * 2, d * 2 );
    this.scene.add( light );

    //Render
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize( window.innerWidth, window.innerHeight ) ;

    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.renderReverseSided = false;

    this.domElement = this.renderer.domElement;
    this.modelObseverable();
  }



  public map(){
    let options:HeightMapOptions = {
      color: "rgb(255,0,0)",
      grid: false
    };

    // this.heightMap(options);
  }

  public modelObseverable(){
    this.map();
    // this.cubicGrid();
    // this.testObj();
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
