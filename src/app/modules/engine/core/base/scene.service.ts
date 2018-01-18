import { Injectable } from '@angular/core';
import {Camera, CubeCamera, OrthographicCamera, Scene, WebGLRenderer} from 'three';
import * as THREE from 'three';

@Injectable()
export class SceneService {

  private _scene: Scene;
  private _renderer: WebGLRenderer;
  private _camera: Camera | OrthographicCamera | CubeCamera;
  private initRenderer: boolean;


  constructor() {
    this.scene = new Scene();

    console.log("scene service1");

    // Render
    this.renderer = new WebGLRenderer({ antialias: true });
    this.renderer.setSize( window.innerWidth, window.innerHeight ) ;

    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap; // default THREE.PCFShadowMap

    this.animation();
  }

  public resizeEvent(event: Event){
    this.renderer.setSize( window.innerWidth, window.innerHeight ) ;
  }


  // Render logic
  public animation() {
    requestAnimationFrame(this.animation.bind(this));
    if (this.camera){
      this.renderer.render( this.scene, <Camera>this.camera );
    }
  }

  get scene(): Scene {
    return this._scene;
  }

  set scene(value: Scene) {
    this._scene = value;
  }

  get renderer(): WebGLRenderer {
    return this._renderer;
  }

  set renderer(value: WebGLRenderer) {
    this._renderer = value;
  }

  get camera(): Camera | OrthographicCamera | CubeCamera {
    return this._camera;
  }

  set camera(value: Camera | OrthographicCamera | CubeCamera) {
    this._camera = value;
  }
}
