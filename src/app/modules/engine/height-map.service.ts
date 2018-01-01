import { Injectable } from '@angular/core';
import * as THREE from 'three';

import {IGEOJson} from "./engine.types";
import {Color, Object3D} from "three";



@Injectable()
export class HeightMapService {

  constructor() { }

  private colorScheme;

  public changeMapFromImage(options, scene: THREE.Scene, img){

    // terrain
    //TODO: сделать добавление без рекваер
    //TODO: вынести, смерджить с настройками

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


        let geometry = new THREE.PlaneGeometry(img.width, img.height, img.width-1, img.height-1);

                // objectPG.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2) );
        for( let i = 0; i < res.length; i++ ){
          geometry.vertices[i].setZ(res[i][2]/10);
        }

        geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2));
        geometry.verticesNeedUpdate = true;

        for (let i = 0; i < geometry.faces.length; i += 2) {
          let color = [
            new THREE.Color(this.colorScheme[i/2][0], this.colorScheme[i/2][1], this.colorScheme[i/2][2]),
            new THREE.Color(this.colorScheme[i/2][0], this.colorScheme[i/2][1], this.colorScheme[i/2][2]),
            new THREE.Color(this.colorScheme[i/2][0], this.colorScheme[i/2][1], this.colorScheme[i/2][2])
          ];

          geometry.faces[i].vertexColors = color;
          geometry.faces[i+1].vertexColors = color;

          // geometry.faces[i].color = new THREE.Color( 0xfff )
          //   .setRGB(this.colorScheme[i/2][0], this.colorScheme[i/2][1], this.colorScheme[i/2][2])

        }
        geometry.elementsNeedUpdate = true;

        // let material = new THREE.MeshBasicMaterial( {
        //     shading: THREE.FlatShading,
        //     vertexColors: THREE.VertexColors
        // });

        let material = new THREE.MeshPhongMaterial( {
          shading: THREE.FlatShading,
          vertexColors: THREE.VertexColors
        } );

        let materialShadow = new THREE.ShadowMaterial( {
          opacity: 1,
          lineWidth: 0.1
        } );

        geometry.colorsNeedUpdate = true;


        console.log(this.colorScheme);
        console.log(geometry);

// materialShadow
        let multiMaterial = [material];

        if (options.grid){
          let grid = new THREE.MeshPhongMaterial( {
            color: 0xfff,
            wireframe: true
          } );

          multiMaterial = [...multiMaterial, grid];
        }

        let objectPG = THREE.SceneUtils.createMultiMaterialObject( geometry, multiMaterial );

        let parent = new THREE.Object3D();
        parent.add(objectPG);


        objectPG.children.map((item: Object3D, index, array) => {
          item.castShadow = true;
          item.receiveShadow = true;
        });

        scene.add(parent);

        return geoJsonObject;
      })
      .then((geoObj)=>{
        let options = {body: geoObj};
        // return new Api().points(options);
      })
      .then((response)=>{
        // console.log(response);
      })
      .catch((err) => {
        console.log(err);
      });

  }

  public changeColorMapFromImage(options, scene, img){
    this
    .parseImageToColorGeo(img)
    .then((res) => {
      console.log(res);
      this.colorScheme = res;
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

  public parseImageToColorGeo(img:HTMLImageElement){
    return new Promise((resolve, reject) => {
      img.onload = () => {
        let data = this.getColorMap(img);
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
    console.log(coordinates);

    return coordinates;
  }

  //  TODO: change void

  /**
   * [getColorMap description]
   * @param  {HTMLImageElement} img [description]
   * @return {any}                  [description]
   */
  public getColorMap(img:HTMLImageElement): any {
    let canvas = document.createElement('canvas');
    canvas.width  = img.width;
    canvas.height = img.height;

    let context = canvas.getContext('2d');
    context.drawImage(img, 0, 0);

    let pix = context.getImageData(0, 0, img.width - 1, img.height - 1).data,
      colorScheme = [];


    //+- (4) потому png в формате rgba.
    for (let i = 0, n = pix.length; i < n; i += (4)) {
      colorScheme.push([pix[i], pix[i+1], pix[i+2]]);
    }
    console.log(colorScheme);

    return colorScheme;
  }

}
