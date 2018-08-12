import { Injectable } from '@angular/core';
import { Camera, Clock, CubeCamera, OrthographicCamera, Scene, WebGLRenderer } from 'three';
import * as THREE from 'three';
import { StorageService } from '@services/storage.service';
import { CAMERA } from '../../../../enums/settings.enum';
import { SettingsService } from '../../../../services/settings.service';

@Injectable()
export class SceneService {
  private _scene: Scene;
  private _renderer: WebGLRenderer;
  private _camera: Camera | OrthographicCamera | CubeCamera;
  private clock = new Clock();

  constructor(
    private storageService: StorageService,
    private settingsService: SettingsService
  ) {
    this.scene = new Scene();

    // свойства Render'а
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

  /**
   * Render logic
   */
  public animation() {
    requestAnimationFrame(this.animation.bind(this));
    let delta = this.clock.getDelta();

    if (this.camera) {
      this.renderer.render(this.scene, <Camera>this.camera);
    }

    // if (this.settingsService.settings.camera.type === CAMERA.FirstPersonCamera) {
    for (let rendererCommand in this.storageService.rendererStorageCommands) {
      this.storageService.rendererStorageCommands[rendererCommand].update(delta);
    }
    // }

    for (let mixerCommand in this.storageService.mixerCommands) {
      this.storageService.mixerCommands[mixerCommand].update(delta);
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
