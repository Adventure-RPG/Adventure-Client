import { Injectable } from '@angular/core';
import {
  BasicShadowMap, Camera, Clock, CubeCamera, OrthographicCamera, PerspectiveCamera, Scene, WebGLRenderer
} from 'three';
import { StorageService } from '@services/storage.service';
import { SettingsService } from '@services/settings.service';
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";
import * as FileSaver from "file-saver";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { BehaviorSubject } from "rxjs/index";

@Injectable()
export class SceneService {
  private _scene: Scene;
  private _renderer: WebGLRenderer;
  private _camera: Camera | OrthographicCamera | CubeCamera;
  private clock = new Clock();
  private currentTime = 0;
  private sceneDimension = {width: 100, height: 100};
  public delta;


  //Подумать о том что бы вынести
  private lightningTimeRate = 1;

  constructor(
    private storageService: StorageService,
    private settingsService: SettingsService
  ) {

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
   * Export scene
   * @param sceneName
   */

  public exportScene(sceneName){
    let exporter = new GLTFExporter();

    // Parse the input and generate the glTF output
    exporter.parse( this.scene, ( gltf ) => {
      this.download( gltf, sceneName, '.gltf' );
    }, {})
  };

  //TODO: возможно вынести в будущем
  public download(exportObj, exportName, exportFormat){
    let file = new File([JSON.stringify(exportObj)], exportName + exportFormat, {type: "text/json;charset=utf-8"});
    FileSaver.saveAs(file);
  };

  public importScene(data){
    // Instantiate a loader
    let loader = new GLTFLoader();

    // Optional: Provide a DRACOLoader instance to decode compressed mesh data
    //     THREE.DRACOLoader.setDecoderPath( '/examples/js/libs/draco' );
    //     loader.setDRACOLoader( new THREE.DRACOLoader() );

    // Optional: Pre-fetch Draco WASM/JS module, to save time while parsing.
    //     THREE.DRACOLoader.getDecoderModule();

    loader.load(
      // resource URL
      data.result,
      // called when the resource is loaded
      ( gltf ) => {
        console.log(gltf);

        this.scene = gltf.scene;
        this.layersList();

      },
      // called while loading is progressing
      ( xhr ) => {
        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
      },
      // called when loading has errors
      ( error ) => {
        console.error( error );
      }
    );

  }


  /**
   * Tree of elements in Scene
   * @type {BehaviorSubject<any[]>}
   */

  nodes = new BehaviorSubject<any[]>([]);

  addNode(node:any):void{
    this.nodes.next(this.nodes.getValue().concat([node]));
  }

  checkedKeys = new BehaviorSubject<string[]>([]);

  addCheckedKeys(key: string):void{
    this.checkedKeys.next(this.checkedKeys.getValue().concat([key]));
  }

  selectedKeys = new BehaviorSubject<string[]>([]);

  addSelectedKeys(key: string):void{
    this.selectedKeys.next(this.selectedKeys.getValue().concat([key]));
  }

  expandedKeys = new BehaviorSubject<string[]>([]);

  addExpandedKeys(key: string):void{
    this.expandedKeys.next(this.expandedKeys.getValue().concat([key]));
  }

  public layersList() {
    if (this.scene) {
      console.log(this.scene.children);

      this.nodes.next([]);
      this.checkedKeys.next([]);
      this.selectedKeys.next([]);
      this.expandedKeys.next([]);

      for (let obj of this.scene.children) {
        let node = this.nodes.getValue().find(node => {
          return node.key === obj.type
        });

        //TODO: подумать над тем нужен ли отдельный кей
        if (!node){
          node = {
            title: obj.type,
            key: obj.type,
            element: obj,
          };

          this.addNode(node);
        }

        // if (node && node.key === 'Group'){
        //   console.log(node.key);
        //   console.log(node.element.children.length);
        // for (let i = 0; i < node.element.children.length; i++) {
        //   let groupChild = node.element.children[i];
        //   node.children.push({
        //     title: groupChild.type,
        //     key: groupChild.type,
        //     element: groupChild
        //   })
        // }
        // } else

        if (node) {

          if (!node.children){
            node.children = [];
          }

          node.children.push({
            title: `${obj.type}-${obj.uuid}`,
            key: obj.uuid,
            element: obj,
            isLeaf: true,
            isSelected: true
          });

          this.addCheckedKeys(obj.uuid);
        }

      }
      // this.engineService.sceneService.scene.children = [];
      console.log(this.nodes);
      console.log(this.scene.children)
    }
  }


  /**
   * Render logic
   * Быть очень аккуратным здесь!!!
   */
  public animation() {
    // console.log(this);

    requestAnimationFrame(this.animation.bind(this));
    this.delta = this.clock.getDelta();

    if (this.camera && this.scene) {
      // console.log(this.camera, this.scene)
      this.renderer.render(this.scene, <Camera>this.camera);
    }

    for (let rendererCommand in this.storageService.rendererStorageCommands) {
      this.storageService.rendererStorageCommands[rendererCommand].update(this.delta);
    }

    for (let mixerCommand in this.storageService.mixerCommands) {
      this.storageService.mixerCommands[mixerCommand].update(this.delta);
    }

    this.render(this.delta);

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
