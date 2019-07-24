import { Injectable } from '@angular/core';
import {
  BasicShadowMap,
  Camera,
  Clock,
  CubeCamera,
  OrthographicCamera,
  Scene,
  WebGLRenderer
} from 'three';
import { StorageService } from '@services/storage.service';
import { SettingsService } from '@services/settings.service';
import { PerspectiveCamera } from 'three';

@Injectable()
export class SceneService {
  private _scene: Scene;
  private _renderer: WebGLRenderer;
  private _camera: Camera | OrthographicCamera | CubeCamera;
  private clock = new Clock();
  private currentTime = 0;
  private sceneDimension = {width: 100, height: 100};

  //Подумать о том что бы вынести
  private lightningTimeRate = 1;

  constructor(private storageService: StorageService, private settingsService: SettingsService) {

    this.scene = new Scene();

    // свойства Render'а
    this.renderer = new WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor(0x000);

    this.renderer.shadowMap.autoUpdate = true;
    this.renderer.gammaInput = true;
    this.renderer.gammaOutput = true;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = BasicShadowMap; // default THREE.PCFShadowMap
  }

  public init(width, height){
    this.sceneDimension = {
      width, height
    };

    this.renderer.setSize(this.sceneDimension.width, this.sceneDimension.height);
    this.animation();
  }

  public resizeEvent(event: Event) {
    if (this.camera && this.camera.type === 'PerspectiveCamera') {
      (<PerspectiveCamera>this.camera).aspect = this.sceneDimension.width / this.sceneDimension.height;
      (<PerspectiveCamera>this.camera).updateProjectionMatrix();
    }

    this.renderer.setSize(this.sceneDimension.width, this.sceneDimension.height);
  }

  /**
   * Render logic
   * Быть очень аккуратным здесь!!!
   */
  public animation() {
    // console.log(this);

    requestAnimationFrame(this.animation.bind(this));
    let delta = this.clock.getDelta();

    if (this.camera && this.scene) {
      // console.log(this.camera, this.scene)
      this.renderer.render(this.scene, <Camera>this.camera);
    }

    for (let rendererCommand in this.storageService.rendererStorageCommands) {
      this.storageService.rendererStorageCommands[rendererCommand].update(delta);
    }

    for (let mixerCommand in this.storageService.mixerCommands) {
      this.storageService.mixerCommands[mixerCommand].update(delta);
    }

    this.render(delta);

    // this.renderer.setSize( window.innerWidth, window.innerHeight );

    // this.composer.setSize( window.innerWidth, window.innerHeight );
  }

  public render(delta) {
    // console.log(this.scene.userData.timeRate, delta);
    this.renderer.gammaInput = true;
    this.renderer.gammaOutput = true;

    this.currentTime += this.lightningTimeRate * delta;
    if (this.currentTime < 0) {
      this.currentTime = 0;
    }

    if (this.scene.userData.render) {
      // console.log(this.scene.userData)
      this.scene.userData.render(this.currentTime);
    }

    for (let utilCommand in this.storageService.utilCommands) {
      this.storageService.utilCommands[utilCommand].update(this.currentTime);
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
