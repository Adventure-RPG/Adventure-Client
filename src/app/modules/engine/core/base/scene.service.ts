import { Injectable } from '@angular/core';
import {Scene, WebGLRenderer} from 'three';
import * as THREE from 'three';

@Injectable()
export class SceneService {

  private _scene: Scene;
  private _renderer: WebGLRenderer;


  constructor() {
    this.scene = new Scene();

    // Render
    this.renderer = new WebGLRenderer({ antialias: true });
    this.renderer.setSize( window.innerWidth, window.innerHeight ) ;

    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap; // default THREE.PCFShadowMap
  }


  // Render logic
  public animation(camera) {
    function callbackAnimation(context){
      context.animation(camera);
    }

    window.requestAnimationFrame(callbackAnimation.bind(null, this, camera));
    this.renderer.render( this.scene, camera );
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

}
