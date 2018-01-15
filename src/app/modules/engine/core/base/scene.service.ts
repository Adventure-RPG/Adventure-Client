import { Injectable } from '@angular/core';
import {Camera, Scene, WebGLRenderer} from 'three';
import * as THREE from 'three';

@Injectable()
export class SceneService {

  private _scene: Scene;
  private _renderer: WebGLRenderer;
  private _camera: Camera;
  private initRenderer: boolean;


  constructor() {
    this.scene = new Scene();

    // Render
    this.renderer = new WebGLRenderer({ antialias: true });
    this.renderer.setSize( window.innerWidth, window.innerHeight ) ;

    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap; // default THREE.PCFShadowMap
  }

  public resizeEvent(event: Event){
    this.renderer.setSize( window.innerWidth, window.innerHeight ) ;
  }


  // Render logic
  public animation() {
    requestAnimationFrame(this.animation.bind(this));
    this.renderer.render( this.scene, this.camera );
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

  get camera(): Camera {
    return this._camera;
  }

  set camera(value: Camera) {
    this._camera = value;
  }
}
