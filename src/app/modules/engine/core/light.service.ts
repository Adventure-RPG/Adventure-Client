import { Injectable } from '@angular/core';
import {
  AmbientLight,
  DirectionalLight,
  DirectionalLightHelper,
  HemisphereLight,
  HemisphereLightHelper, LightShadow,
  PointLight,
  PointLightHelper,
  SpotLight,
  SpotLightHelper,
  SpotLightShadow,
  PerspectiveCamera, Color
} from 'three';
import { EngineService } from '../engine.service';


//Тень зависит от размера картины

const SHADOW_MAP_WIDTH = 2048,
  SHADOW_MAP_HEIGHT = 2048;

export interface Shadow {
  castShadow: boolean;
  camera: PerspectiveCamera | any;
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
    // https://github.com/mrdoob/js/issues/12452
    // any because Color type doesn't support
    let color: any = new Color(lightEntity.color);
    // console.log(lightEntity.color);
    // console.log(color);

    switch (type) {
      case 'AmbientLight':
        light = new AmbientLight(color, lightEntity.intensity);

        light.position.set(lightEntity.position.x, lightEntity.position.y, lightEntity.position.z);

        //HELPLER
        // light.castShadow = true;

        this.engineService.sceneService.scene.add(light);
        break;
      case 'DirectionalLight':
        light = new DirectionalLight(color, lightEntity.intensity);
        light.position.set(lightEntity.position.x, lightEntity.position.y, lightEntity.position.z);
        //HELPLER
        console.log(light)
        light.castShadow = lightEntity.shadow.castShadow;
        light.shadow.mapSize.width = SHADOW_MAP_WIDTH;
        light.shadow.mapSize.height = SHADOW_MAP_HEIGHT;
        (<DirectionalLight>light).shadow.camera.left = lightEntity.shadow.camera.left;
        (<DirectionalLight>light).shadow.camera.right = lightEntity.shadow.camera.right;
        (<DirectionalLight>light).shadow.camera.bottom = lightEntity.shadow.camera.bottom;
        (<DirectionalLight>light).shadow.camera.top = lightEntity.shadow.camera.top;

        //TODO: косяк типов, написать ПР
        this.engineService.sceneService.scene.add(light);

        //TODO: in configurate layers
        dirLightHelper = new DirectionalLightHelper(<DirectionalLight>light, lightLength);
        this.engineService.sceneService.scene.add(new CameraHelper(light.shadow.camera));

        this.engineService.sceneService.scene.add(dirLightHelper);

        break;
      case 'HemisphereLight':
        light = new HemisphereLight(
          color,
          <any>new Color(lightEntity.groundColor),
          lightEntity.intensity
        );
        light.position.set(lightEntity.position.x, lightEntity.position.y, lightEntity.position.z);
        this.engineService.sceneService.scene.add(light);

        break;
      case 'PointLight':
        // console.log(lightEntity.intensity);
        // console.log(lightEntity.distance);
        // console.log(lightEntity.decay);
        light = new PointLight(
          color,
          lightEntity.intensity,
          lightEntity.distance,
          lightEntity.decay
        );
        // light = new PointLight( color,  1, 100 );
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
        let pointLightHelper = new PointLightHelper(<PointLight>light, sphereSize);
        this.engineService.sceneService.scene.add(pointLightHelper);

        // dirLightHelper = new PointLightHelper( light, lightLength );
        // this.engineService.sceneService.scene.add( dirLightHelper );

        break;
      // TODO: update and add
      // case 'RectAreaLight':
      //   light = new RectAreaLight( 0xffffff, undefined,  100, 100 );
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
      //   dirLightHelper = new PointLightHelper( light, lightLength );
      //   this.engineService.sceneService.scene.add( dirLightHelper );
      //
      //   break;
      case 'SpotLight':
        light = new SpotLight(0xffffff);
        // light = new SpotLight( color,  lightEntity.intensity, lightEntity.distance, lightEntity.angle, lightEntity.exponent, lightEntity.decay   );
        // light.color.setHSL( 0.1, 1, 0.95 );
        light.position.set(lightEntity.position.x, lightEntity.position.y, lightEntity.position.z);
        //HELPLER
        light.castShadow = true;
        // (<SpotLightShadow>light.shadow).camera.far = 1000;
        // (<SpotLightShadow>light.shadow).camera.near = 20;
        // (<SpotLightShadow>light.shadow).camera.fov = 50;

        light.target.position.set( 0, 0, 0 );

        light.shadow = new LightShadow( new PerspectiveCamera( 50, 1, 700, 2000 ) );
        light.shadow.bias = 0.0001;
        light.shadow.mapSize.width = SHADOW_MAP_WIDTH;
        light.shadow.mapSize.height = SHADOW_MAP_HEIGHT;

        // dirLight.shadow.camera.left   = -d;
        // dirLight.shadow.camera.right  =  d;
        // dirLight.shadow.camera.top    =  d;
        // dirLight.shadow.camera.bottom = -d;
        //
        // dirLight.shadow.camera.far = 5;

        this.engineService.sceneService.scene.add(light);
        dirLightHelper = new SpotLightHelper(<any>light);
        this.engineService.sceneService.scene.add(dirLightHelper);

        break;
      default:
        console.warn(`unknown type: ${type}`);
        break;
    }
  }
}
