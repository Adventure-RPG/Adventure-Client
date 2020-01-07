import { Injectable } from '@angular/core';
import { AnimationMixer, Box3, Group, Mesh, MeshBasicMaterial, TextureLoader } from 'three';
import { SceneService } from '@modules/engine/core/base/scene.service';
import { StorageService } from '@services/storage.service';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import UuidStatic = require('uuid');

export class ModelLoaderClass {

  constructor(){}

  public static loadModel({modelForm, storageService, callback}): Promise<any>{

    let re = /(?:\.([^.]+))?$/;
    let loaderName = re.exec(modelForm.model.path)[1];

    switch(loaderName){
      case 'fbx':
        return this.loadFBX({modelForm, storageService, callback});
        break;
      default:
        return new Promise<any>(() => {
          return 'default'
        });
        break;
    }

  }

  //TODO: вынести аплойд файлов
  /**
   * Метод загрузки FBX модели
   * @param url
   */
  public static loadFBX({modelForm, storageService, callback}): Promise<any> {
    console.log(modelForm);
    // Вынести в отдельный флоу

    // let test = require('./../../libs/inflate.min');
    // console.log(test.Zlib)
    //Инцилизация модуля.
    // let textureLoader = new TextureLoader();
    // let material;
    // if (modelForm && modelForm.texturePath && modelForm.texturePath.path) {
    //
    //   let texture = textureLoader
    //     .load(
    //       modelForm.texturePath.path,
    //       (texture) => {
    //         return texture
    //       },
    //       // onProgress callback currently not supported
    //       undefined,
    //       // onError callback
    //       ( err ) => {
    //         console.error( err );
    //       }
    //     );
    //
    //   material = new MeshBasicMaterial( {
    //     map: texture
    //   });
    // } else {
    //
    //   material = new MeshBasicMaterial( {      });
    // }

    function getRandomizer(bottom, top) {
      return Math.floor( Math.random() * ( 1 + top - bottom ) ) + bottom;
    }

    console.log(modelForm.animate)



    // TODO: разобраться с типом лоадера
    let loader: any = new FBXLoader();

    new Promise(resolve => loader.load(
      modelForm.animates[0],
      (group: Group) => {
        //Остноавился тут, добавляю список анимаций
        console.log(group);
      })
    );
    return new Promise(resolve => loader.load(
      modelForm.model.path,
      (group: Group) => {
        console.log(group)
        let box = new Box3().setFromObject( group );
        let modelGuid = UuidStatic.v1();
        console.log( box.min, box.max, (<any>box).getSize() );


        // if (false){
        group['mixer'] = new AnimationMixer(group);

        storageService.mixerCommandPush(
          `mixers::${modelForm.model.name}::${modelGuid}`,
          group['mixer']
        );

        let animationLength = group['animations'].length;


        let clipAction = group['animations'][getRandomizer(0,animationLength) - 1];
        console.log(getRandomizer(0,animationLength))

        let action = group['mixer'].clipAction(clipAction);
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

        group.scale.setScalar(modelForm.size/(<any>box).getSize().x * 8 * 5 || 1);

        group.translateX(modelForm.vector.x || 0);
        group.translateY(modelForm.vector.y || 0);
        group.translateZ(modelForm.vector.z || 0);

        // group.traverse((child: Mesh) => {
        //   if (child instanceof Mesh) {
        //     // console.log(child);
        //     child.material = material;
        //   }
        // });

        // console.log(group);

        callback(group);
      },
      (event) => {
        console.log(event);
      },
      (event) => {
        console.error(event);
      }
    ));
    // console.log(texture);

    // console.log(model)
  }
}
