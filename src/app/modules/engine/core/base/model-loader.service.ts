import {Injectable} from '@angular/core';
import {AnimationMixer, FBXLoader, Group, Mesh} from 'three';
import fbxLoader from '@libs/FBXLoader';
import {SceneService} from '@modules/engine/core/base/scene.service';
import {StorageService} from '@services/storage.service';
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

  //TODO: вынести в отдельный модуль
  //TODO: вынести аплойд файлов
  /**
   * Метод загрузки FBX модели
   * @param url
   */
  public loadFBX(model) {
    // Вынести в отдельный флоу

    // let test = require('./../../libs/inflate.min');
    // console.log(test.Zlib)
    //Инцилизация модуля.

    // let texture = new TextureLoader().load("assets/models/polygon-knights/Textures/Texture_01_Swap_Snow_To_Grass.png");

    // let texture;
    if (model.texturePath) {
      // texture = new TextureLoader().load(model.texturePath, data => {
      //   console.log(data);
      //   let modelLoader = loader.load(
      //     model.path,
      //     (group: Group) => {
      //       // let material = new MeshNormalMaterial();
      //       // let mesh = new Mesh(geometry, material);
      //       // console.log(mesh)
      //       // this.scene.add(mesh);
      //       // // if you want to add your custom material
      //       //
      //       // let materialObj = new THREE.MeshPhongMaterial({
      //       // map: texture
      //       // });
      //       // TODO: getSize() требует аргумент
      //       // let box = new Box3().setFromObject(group);
      //       // console.log(box.min, box.max, box.getSize() );
      //       //
      //       //
      //
      //       // group.scale.set(1 / box.getSize().x * 8, 1 / box.getSize().x  * 8, 1 / box.getSize().x  * 8);
      //       // group.scale.set(1, 1, 1);
      //       // group.traverse((child: Mesh) => {
      //       //     if (child instanceof Mesh) {
      //       //
      //       //         console.log(child);
      //       //         (<MeshLambertMaterial>child.material).map = texture;
      //       //         (<MeshLambertMaterial>child.material).needsUpdate = true;
      //       //
      //       //     }
      //       // });
      //
      //       this._sceneService.scene.add(group);
      //     },
      //     event => {
      //       console.log(event);
      //     },
      //     event => {
      //       console.error(event);
      //     }
      //   );
      // });
    }

    if (model.name) {
      let loader: FBXLoader = fbxLoader().prototype;
      let modelGuid = UuidStatic.v1();
      loader.load(
        model.path,
        (group: Group) => {
          //Остноавился тут
          // if (false){
          group['mixer'] = new AnimationMixer(group);

          this.storageService.mixerCommandPush(
            `mixers::${model.name}::${modelGuid}`,
            group['mixer']
          );

          let action = group['mixer'].clipAction(group['animations'][0]);
          action.play();

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

          group.scale.set(0.1, 0.1, 0.1);
          // group.traverse((child: THREE.Mesh) => {
          //     if (child instanceof THREE.Mesh) {
          //
          //       console.log(child);
          //         (<THREE.MeshLambertMaterial>child.material).map = texture;
          //         (<THREE.MeshLambertMaterial>child.material).needsUpdate = true;
          //
          //     }
          // });

          console.log(group);

          this.sceneService.scene.add(group);
        },
        event => {
          console.log(event);
        },
        event => {
          console.error(event);
        }
      );
    }
    // console.log(texture);

    // console.log(model)
  }
}
