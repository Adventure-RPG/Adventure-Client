import { Injectable } from '@angular/core';
import * as THREE from 'three';
import {EngineService} from "../engine.service";
import * as inflate from 'inflate';

@Injectable()
export class LightService {

  constructor(
    private engineService: EngineService
  ) { }


  addLight(lightEntity: {
    color: string;
    groundColor: string;
    intensity: number;
    distance: number;
    exponent: number;
    angle: number;
    decay: number ;
    position: {
      x: number;
      y: number;
      z: number;
    }
  }, type){
    let lightLength = 50;
    let d = 10;
    let light: THREE.AmbientLight | THREE.DirectionalLight | THREE.HemisphereLight | THREE.PointLight | THREE.SpotLight;
    let dirLightHelper: THREE.DirectionalLightHelper | THREE.HemisphereLightHelper | THREE.PointLightHelper;

    // TODO: clean interface
    // https://github.com/mrdoob/three.js/issues/12452
    // any because Color type doesn't support
    let color: any = new THREE.Color(lightEntity.color);
    // console.log(lightEntity.color);
    // console.log(color);

    switch (type){
      case 'AmbientLight':
        light = new THREE.AmbientLight( color, lightEntity.intensity );

        light.position.set( lightEntity.position.x, lightEntity.position.y, lightEntity.position.z );

        //HELPLER
        // light.castShadow = true;

        this.engineService.sceneService.scene.add( light );
        break;
      case 'DirectionalLight':
        light = new THREE.DirectionalLight( color,  lightEntity.intensity  );
        light.position.set( lightEntity.position.x, lightEntity.position.y, lightEntity.position.z );
        //HELPLER
        light.castShadow = true;
        light.shadow.mapSize.width  = 50;
        light.shadow.mapSize.height = 50;

        // dirLight.shadow.camera.left   = -d;
        // dirLight.shadow.camera.right  =  d;
        // dirLight.shadow.camera.top    =  d;
        // dirLight.shadow.camera.bottom = -d;
        //
        // dirLight.shadow.camera.far = 5;
        this.engineService.sceneService.scene.add( light );

        //TODO: in configurate layers
        dirLightHelper = new THREE.DirectionalLightHelper( light, lightLength );
        this.engineService.sceneService.scene.add( dirLightHelper );

        break;
      case 'HemisphereLight':
        light = new THREE.HemisphereLight( color, <any>new THREE.Color(lightEntity.groundColor), lightEntity.intensity );
        light.position.set( lightEntity.position.x, lightEntity.position.y, lightEntity.position.z );
        this.engineService.sceneService.scene.add( light );

        break;
      case 'PointLight':
        // console.log(lightEntity.intensity);
        // console.log(lightEntity.distance);
        // console.log(lightEntity.decay);
        light = new THREE.PointLight( color,  lightEntity.intensity, lightEntity.distance, lightEntity.decay  );
        // light = new THREE.PointLight( color,  1, 100 );
        light.position.set( lightEntity.position.x, lightEntity.position.y, lightEntity.position.z );
        //HELPLER
        light.castShadow = true;
        light.shadow.bias = 0.01;
        light.shadow.radius = 1;
        // light.shadow.mapSize.width  = 50;
        // light.shadow.mapSize.height = 50;

        this.engineService.sceneService.scene.add( light );


        let sphereSize = 1;
        let pointLightHelper = new THREE.PointLightHelper( light, sphereSize );
        this.engineService.sceneService.scene.add( pointLightHelper );

        // dirLightHelper = new THREE.PointLightHelper( light, lightLength );
        // this.engineService.sceneService.scene.add( dirLightHelper );

        break;
      // TODO: update and add
      // case 'RectAreaLight':
      //   light = new THREE.RectAreaLight( 0xffffff, undefined,  100, 100 );
      //   light.color.setHSL( 0.1, 1, 0.95 );
      //   light.position.set( -lightLength, lightLength, lightLength );
      //   light.shadow.bias = 0.0001;
      //   //HELPLER
      //   light.castShadow = true;
      //   light.shadow.mapSize.width  = 50;
      //   light.shadow.mapSize.height = 50;
      //
      //   // dirLight.shadow.camera.left   = -d;
      //   // dirLight.shadow.camera.right  =  d;
      //   // dirLight.shadow.camera.top    =  d;
      //   // dirLight.shadow.camera.bottom = -d;
      //   //
      //   // dirLight.shadow.camera.far = 5;
      //
      //   this.engineService.sceneService.scene.add( light );
      //   dirLightHelper = new THREE.PointLightHelper( light, lightLength );
      //   this.engineService.sceneService.scene.add( dirLightHelper );
      //
      //   break;
      case 'SpotLight':
        light = new THREE.SpotLight( color,  lightEntity.intensity, lightEntity.distance, lightEntity.angle, lightEntity.exponent, lightEntity.decay   );
        light.color.setHSL( 0.1, 1, 0.95 );
        light.position.set( lightEntity.position.x, lightEntity.position.y, lightEntity.position.z );
        light.shadow.bias = 0.0001;
        //HELPLER
        // light.castShadow = true;
        light.shadow.mapSize.width  = 50;
        light.shadow.mapSize.height = 50;

        // dirLight.shadow.camera.left   = -d;
        // dirLight.shadow.camera.right  =  d;
        // dirLight.shadow.camera.top    =  d;
        // dirLight.shadow.camera.bottom = -d;
        //
        // dirLight.shadow.camera.far = 5;

        this.engineService.sceneService.scene.add( light );
        dirLightHelper = new THREE.SpotLightHelper( light );
        this.engineService.sceneService.scene.add( dirLightHelper );

        break;
      default:
        console.warn(`unknown type: ${type}`);
        break;
    }

  }

}
