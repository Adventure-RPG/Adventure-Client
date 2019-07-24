import { Injectable } from '@angular/core';
import {
  AnimationMixer, BoxGeometry, Group, Mesh, MeshBasicMaterial, MeshLambertMaterial, MeshPhongMaterial, PlaneGeometry,
  TextureLoader
} from 'three';
import fbxLoader from '@libs/FBXLoader';
import { SceneService } from '@modules/engine/core/base/scene.service';
import { StorageService } from '@services/storage.service';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

import UuidStatic = require('uuid');

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

          group.translateX(modelForm.vector.x);
          group.translateY(modelForm.vector.y);
          group.translateZ(modelForm.vector.z);

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
}
