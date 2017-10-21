import { Component, OnInit } from '@angular/core';
import {DirectionalLight, HemisphereLight, Light, PointLight, SpotLight} from "three";
import {ColorPickerService} from "angular4-color-picker/lib/color-picker.service";
import {EngineService} from "../../../engine/engine.service";
import * as THREE from 'three';

@Component({
  selector: 'adventure-lights',
  templateUrl: './lights.component.html',
  styleUrls: ['./lights.component.scss']
})
export class LightsComponent implements OnInit {

  public color: string = "#127bdc";
  public groundColor: string = "#127bdc";
  public intensity: number = 1;
  public distance: number = 10;
  public exponent: number = 0;
  public angle: number = 0.52;
  public decay: number = 2;

  addLight(event, type){
    let lightLength = 50;
    let d = 10;
    let light: THREE.AmbientLight | THREE.DirectionalLight | THREE.HemisphereLight | THREE.PointLight | THREE.SpotLight;
    let dirLightHelper: THREE.DirectionalLightHelper | THREE.HemisphereLightHelper | THREE.PointLightHelper;

    //TODO: clean interface
    //https://github.com/mrdoob/three.js/issues/12452
    //any because Color type doesn't support
    let color: any = new THREE.Color(this.color);
    console.log(`${this.color}`);
    console.log(color);

    switch (type){
      case 'AmbientLight':
        light = new THREE.AmbientLight( color, this.intensity );

        light.position.set( -lightLength, lightLength, lightLength );

        //HELPLER
        light.castShadow = true;

        this.engineService.scene.add( light );
        break;
      case 'DirectionalLight':
        light = new THREE.DirectionalLight( color,  this.intensity  );
        light.position.set( -lightLength, lightLength, lightLength );
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
        this.engineService.scene.add( light );

        //TODO: in configurate layers
        dirLightHelper = new THREE.DirectionalLightHelper( light, lightLength );
        this.engineService.scene.add( dirLightHelper );

        break;
      case 'HemisphereLight':
        light = new THREE.HemisphereLight( color, <any>new THREE.Color(this.groundColor), this.intensity );
        light.position.set(- d * 10, d * 2, d * 2 );
        this.engineService.scene.add( light );

        break;
      case 'PointLight':
        light = new THREE.PointLight( color,  this.intensity, this.distance, this.decay  );
        light.position.set( -lightLength, lightLength, lightLength );
        //HELPLER
        light.castShadow = true;
        // light.shadow.mapSize.width  = 50;
        // light.shadow.mapSize.height = 50;

        // dirLight.shadow.camera.left   = -d;
        // dirLight.shadow.camera.right  =  d;
        // dirLight.shadow.camera.top    =  d;
        // dirLight.shadow.camera.bottom = -d;
        // dirLight.shadow.camera.far = 5;

        this.engineService.scene.add( light );
        dirLightHelper = new THREE.PointLightHelper( light, lightLength );
        this.engineService.scene.add( dirLightHelper );

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
      //   this.engineService.scene.add( light );
      //   dirLightHelper = new THREE.PointLightHelper( light, lightLength );
      //   this.engineService.scene.add( dirLightHelper );
      //
      //   break;
      case 'SpotLight':
        light = new THREE.SpotLight( color,  this.intensity  );
        light.color.setHSL( 0.1, 1, 0.95 );
        light.position.set( -lightLength, lightLength, lightLength );
        light.shadow.bias = 0.0001;
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

        this.engineService.scene.add( light );
        dirLightHelper = new THREE.SpotLightHelper( light );
        this.engineService.scene.add( dirLightHelper );

        break;
      default:
        console.warn(`unknown type: ${type}`);
        break;
    }

  }

  constructor(private cpService: ColorPickerService,
  private engineService: EngineService,) { }

  ngOnInit() {
  }

}
