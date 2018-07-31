import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { Camera, Clock, CubeCamera, OrthographicCamera, Scene, WebGLRenderer } from 'three';
import { StorageService } from '@services/storage.service';

@Injectable()
export class SceneService {
  private _scene: Scene;
  private _renderer: WebGLRenderer;
  private _camera: Camera | OrthographicCamera | CubeCamera;

  constructor(private storageService: StorageService) {
    this.scene = new Scene();

    // Render
    this.renderer = new WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor(0x000);

    this.renderer.shadowMap.autoUpdate = true;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap; // default THREE.PCFShadowMap

    this.animation();
  }

  public resizeEvent(event: Event) {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // TODO: добавить сглаживание
  // Render logic
  public animation() {
    let clock = new Clock();

    if (this.camera) {
      this.renderer.render(this.scene, <Camera>this.camera);
    }

    for (let rendererCommand in this.storageService.rendererStorageCommands) {
      this.storageService.rendererStorageCommands[rendererCommand].rendererUpdate(clock.getDelta());
    }

    requestAnimationFrame(this.animation.bind(this));
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
