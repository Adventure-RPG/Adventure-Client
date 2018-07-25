import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { EngineService } from '../engine.service';
import * as inflate from 'inflate';
import { PerspectiveCamera } from 'three/three-core';
import {
  AmbientLight,
  DirectionalLight,
  DirectionalLightHelper,
  HemisphereLight,
  HemisphereLightHelper,
  Light,
  PointLight,
  PointLightHelper,
  SpotLight,
  SpotLightHelper,
  SpotLightShadow
} from 'three';

const SHADOW_MAP_WIDTH = 2048,
  SHADOW_MAP_HEIGHT = 1024;

export interface Shadow {
  castShadow: boolean;
  camera: PerspectiveCamera;
}

export interface Position {
  x: number;
  y: number;
  z: number;
}

export interface LightEntity {
  color: string;
  groundColor: string;
  intensity: number;
  distance: number;
  exponent: number;
  angle: number;
  decay: number;
  position: Position;
  shadow?: Shadow;
}

@Injectable()
export class LightService {
  constructor(private engineService: EngineService) {}

  addLight(lightEntity: LightEntity, type) {
    let lightLength = 50;
    let d = 10;
    let light: AmbientLight | DirectionalLight | HemisphereLight | PointLight | SpotLight;
    let dirLightHelper:
      | DirectionalLightHelper
      | HemisphereLightHelper
      | PointLightHelper
      | SpotLightHelper;

    // TODO: clean interface
    // https://github.com/mrdoob/three.js/issues/12452
    // any because Color type doesn't support
    let color: any = new THREE.Color(lightEntity.color);
    // console.log(lightEntity.color);
    // console.log(color);

    switch (type) {
      case 'AmbientLight':
        light = new THREE.AmbientLight(color, lightEntity.intensity);

        light.position.set(lightEntity.position.x, lightEntity.position.y, lightEntity.position.z);

        //HELPLER
        // light.castShadow = true;

        this.engineService.sceneService.scene.add(light);
        break;
      case 'DirectionalLight':
        light = new THREE.DirectionalLight(color, lightEntity.intensity);
        light.position.set(lightEntity.position.x, lightEntity.position.y, lightEntity.position.z);
        //HELPLER
        light.castShadow = true;
        light.shadow.mapSize.width = 50;
        light.shadow.mapSize.height = 50;

        //TODO: косяк типов, написать ПР
        (<any>light.shadow.camera).left = -50;
        (<any>light.shadow.camera).right = 50;
        (<any>light.shadow.camera).top = 50;
        (<any>light.shadow.camera).bottom = -50;
        (<any>light.shadow.camera).far = 5000;
        this.engineService.sceneService.scene.add(light);

        //TODO: in configurate layers
        dirLightHelper = new THREE.DirectionalLightHelper(<DirectionalLight>light, lightLength);
        this.engineService.sceneService.scene.add(new THREE.CameraHelper(light.shadow.camera));

        this.engineService.sceneService.scene.add(dirLightHelper);

        break;
      case 'HemisphereLight':
        light = new THREE.HemisphereLight(
          color,
          <any>new THREE.Color(lightEntity.groundColor),
          lightEntity.intensity
        );
        light.position.set(lightEntity.position.x, lightEntity.position.y, lightEntity.position.z);
        this.engineService.sceneService.scene.add(light);

        break;
      case 'PointLight':
        // console.log(lightEntity.intensity);
        // console.log(lightEntity.distance);
        // console.log(lightEntity.decay);
        light = new THREE.PointLight(
          color,
          lightEntity.intensity,
          lightEntity.distance,
          lightEntity.decay
        );
        // light = new THREE.PointLight( color,  1, 100 );
        light.position.set(lightEntity.position.x, lightEntity.position.y, lightEntity.position.z);
        //HELPLER
        // light.castShadow = true;
        // light.shadow.mapSize.width = 256;  // default
        // light.shadow.mapSize.height = 256; // default
        // light.shadow.bias = 0.01;
        // light.shadow.radius = 1;
        // light.shadow.mapSize.width  = 50;
        // light.shadow.mapSize.height = 50;

        this.engineService.sceneService.scene.add(light);

        let sphereSize = 1;
        let pointLightHelper = new THREE.PointLightHelper(<PointLight>light, sphereSize);
        this.engineService.sceneService.scene.add(pointLightHelper);

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
        light = new THREE.SpotLight(0xffffff, 0.5, 0, Math.PI / 2, 1);
        // light = new THREE.SpotLight( color,  lightEntity.intensity, lightEntity.distance, lightEntity.angle, lightEntity.exponent, lightEntity.decay   );
        // light.color.setHSL( 0.1, 1, 0.95 );
        light.position.set(lightEntity.position.x, lightEntity.position.y, lightEntity.position.z);
        light.shadow.bias = 0.0001;
        //HELPLER
        // light.castShadow = true;
        light.shadow.mapSize.width = SHADOW_MAP_WIDTH;
        light.shadow.mapSize.height = SHADOW_MAP_HEIGHT;
        (<SpotLightShadow>light.shadow).camera.far = 5000;
        (<SpotLightShadow>light.shadow).camera.near = 1200;
        (<SpotLightShadow>light.shadow).camera.fov = 50;

        // dirLight.shadow.camera.left   = -d;
        // dirLight.shadow.camera.right  =  d;
        // dirLight.shadow.camera.top    =  d;
        // dirLight.shadow.camera.bottom = -d;
        //
        // dirLight.shadow.camera.far = 5;

        this.engineService.sceneService.scene.add(light);
        dirLightHelper = new THREE.SpotLightHelper(<any>light);
        this.engineService.sceneService.scene.add(dirLightHelper);

        break;
      default:
        console.warn(`unknown type: ${type}`);
        break;
    }
  }
}
