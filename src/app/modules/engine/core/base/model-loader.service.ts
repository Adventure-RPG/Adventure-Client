import { Injectable } from '@angular/core';
import { AnimationMixer, Group, Mesh, MeshBasicMaterial, TextureLoader } from 'three';
import { SceneService } from '@modules/engine/core/base/scene.service';
import { StorageService } from '@services/storage.service';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import UuidStatic = require('uuid');
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

@Injectable()
export class ModelLoaderService {
  get sceneService(): SceneService {
    return this._sceneService;
  }

  set sceneService(value: SceneService) {
    this._sceneService = value;
  }

  get storageService(): StorageService {
    return this._storageService;
  }

  set storageService(value: StorageService) {
    this._storageService = value;
  }

  constructor(private _sceneService: SceneService, private _storageService: StorageService) {}

  public loadModel(modelForm){

    let re = /(?:\.([^.]+))?$/;
    let loaderName = re.exec(modelForm.model.path)[1];

    switch(loaderName){
      case 'fbx':
        this.loadFBX(modelForm);
        break;
      default:
        break;
    }

  }

  //TODO: вынести аплойд файлов
  /**
   * Метод загрузки FBX модели
   * @param url
   */
  public loadFBX(modelForm) {
    console.log(modelForm);
    // Вынести в отдельный флоу

    // let test = require('./../../libs/inflate.min');
    // console.log(test.Zlib)
    //Инцилизация модуля.
    let textureLoader = new TextureLoader();
    let material;
    if (modelForm.texturePath.path) {

      let texture = textureLoader
        .load(
          modelForm.texturePath.path,
          (texture) => {
            return texture
          },
          // onProgress callback currently not supported
          undefined,
          // onError callback
          ( err ) => {
            console.error( err );
          }
      );

      material = new MeshBasicMaterial( {
        map: texture
      });
    } else {

      material = new MeshBasicMaterial( {      });
    }

    if (modelForm.model.name && modelForm.model.path) {
      // TODO: разобраться с типом лоадера
      let loader: any = new FBXLoader();
      let modelGuid = UuidStatic.v1();
      loader.load(
        modelForm.model.path,
        (group: Group) => {
          console.log(group)
          //Остноавился тут
          // if (false){
          group['mixer'] = new AnimationMixer(group);

          this.storageService.mixerCommandPush(
            `mixers::${modelForm.model.name}::${modelGuid}`,
            group['mixer']
          );

          // let action = group['mixer'].clipAction(group['animations'][0]);
          // action.play();

          group.traverse((child: Mesh) => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });
          // }

          // let material = new MeshNormalMaterial();
          // let mesh = new Mesh(geometry, material);
          // console.log(mesh)
          // this.sceneService.scene.add(mesh);

          // if you want to add your custom material

          // let materialObj = new MeshPhongMaterial({
          //   map: texture
          // });

          group.scale.setScalar(modelForm.size || 1);

          group.translateX(modelForm.vector.x || 0);
          group.translateY(modelForm.vector.y || 0);
          group.translateZ(modelForm.vector.z || 0);

          group.traverse((child: Mesh) => {
              if (child instanceof Mesh) {
                // console.log(child);
                child.material = material;
              }
          });

          // console.log(group);

          this.sceneService.scene.add(group);
        },
        (event) => {
          console.log(event);
        },
        (event) => {
          console.error(event);
        }
      );
    }
    // console.log(texture);

    // console.log(model)
  }

  //TODO: вынести аплойд файлов
  /**
   * Метод загрузки FBX модели
   * @param url
   */
  public loadGLTF(url) {

    const loader = new GLTFLoader();

    //TODO: check dracoloader
    // const dracoLoader = new DRACOLoader();
    // dracoLoader.setDecoderPath( 'three/examples/js/libs/draco/' );
    // loader.setDRACOLoader( dracoLoader );
      // Load a glTF resource
    loader.load(
      // resource URL
      url,
      // called when the resource is loaded
      ( gltf ) => {

        this.sceneService.scene.add( gltf.scene );

        gltf.animations; // Array<THREE.AnimationClip>
        gltf.scene; // THREE.Group
        gltf.scenes; // Array<THREE.Group>
        gltf.cameras; // Array<THREE.Camera>
        gltf.asset; // Object

      },
      // called while loading is progressing
      function ( xhr ) {

        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

      },
      // called when loading has errors
      function ( error ) {

        console.log(error);
        console.log( 'An error happened' );

      }
    );
  }
}
