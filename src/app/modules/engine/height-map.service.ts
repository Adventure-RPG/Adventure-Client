import { Injectable } from '@angular/core';
import * as THREE from 'three';

import {IGEOJson} from "./engine.types";



//TODO: clear
declare let require: any;

@Injectable()
export class HeightMapService {

  constructor() { }

  public changeMapFromImage(options, scene){

    console.log(options)

    // terrain
    let img: any = new Image();
    //TODO: сделать добавление без рекваер
    //TODO: вынести, смерджить с настройками
    img.src = require("assets/images/heightmap/heightmap_128.jpg");

    this
      .parseImageToGeo(img)
      .then((res:number[][]) => {
        let geoJsonObject:IGEOJson = {
          "type": "Feature",
          "geometry": {
            "type": "Polygon",
            "coordinates": [
              res
            ]
          },
          "properties": {
            "name": "Ocean"
          }
        };

        console.log(options)

        let holes = [];
        let triangles, mesh;
        let geometry = new THREE.PlaneGeometry(img.width, img.height, img.width-1, img.height-1);
        let material = new THREE.MeshPhongMaterial( {
          color: 'rgba(255, 255, 255)',
          shading: THREE.FlatShading
        } );

        let grid = new THREE.MeshPhongMaterial( {
          color: 0xfff,
          wireframe: true
        } );

        for( let i = 0; i < res.length; i++ ){
          geometry.vertices[i].setZ(res[i][2]/10);
        }

        let objectPG = THREE.SceneUtils.createMultiMaterialObject( geometry, [material] );

        let parent = new THREE.Object3D();
        objectPG.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2) );
        parent.add(objectPG);

        scene.add(parent);

        if (options.grid){
          objectPG = THREE.SceneUtils.createMultiMaterialObject( geometry, [grid] );
          parent = new THREE.Object3D();
          objectPG.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2) );
          parent.add(objectPG);
          scene.add(parent);
        }

        return geoJsonObject;
      })
      .then((geoObj)=>{
        let options = {body: geoObj};
        // return new Api().points(options);
      })
      .then((response)=>{
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
      });

  }

  public parseImageToGeo(img:HTMLImageElement){
    return new Promise((resolve, reject) => {
      img.onload = () => {
        let data = this.getGeoHeight(img);
        resolve(data);
      };
    });
  }

  /**
   *
   * @param img
   * @returns {Array of Array of numbers}
   */
  public getGeoHeight(img:HTMLImageElement):Array<Array<number>> {
    let canvas = document.createElement('canvas');
    canvas.width  = img.width;
    canvas.height = img.height;

    let context = canvas.getContext('2d');
    context.drawImage(img, 0, 0);

    let pix = context.getImageData(0, 0, img.width, img.height).data,
      coordinates = [];

    //+- (4) потому png в формате rgba.
    for (let i = 0, n = pix.length; i < n; i += (4)) {
      coordinates.push([pix[i], pix[i+1], pix[i+2]]);
    }

    return coordinates;
  }

}
