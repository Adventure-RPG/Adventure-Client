import { Injectable } from '@angular/core';

import { IGEOJson } from '../../engine.types';
import {
  BoxGeometry, DoubleSide, FaceNormalsHelper, Geometry, GeometryUtils, Matrix4, Mesh, MeshNormalMaterial,
  MeshPhongMaterial,
  ObjectSpaceNormalMap, Scene,
  ShadowMaterial, TangentSpaceNormalMap,
  VertexColors
} from 'three';
import { Terrain } from '../utils/terrain';
import { Noise } from '@modules/engine/core/utils/noise';
import { environment } from "../../../../../environments/environment";
import { HeightMapOptions } from "@modules/engine/engine.types";

// import * as SimplexNoise from 'simplex-noise';

@Injectable()
export class HeightMapService {
  private colorScheme;
  private mapData;

  constructor() {}

  //TODO: пустить параллельно
  public map(img, model) {
    let options: HeightMapOptions = {
      ...model,
      grid: false
    };

    return this.changeMapFromImage(options, img);
  }

  public generateFromNoise(){
    // return this.generateDungeonTerrain();
    // this.heightMapService.getHeightMap(this.sceneService.scene);
  }

  // terrain
  public changeMapFromImage(options, img): Promise<{geoJson: IGEOJson, terrain: Mesh}> {
    //TODO: вынести все текстуры и материалы в отдельный сервис

    return this.parseImageToGeo(img)
      .then((res: number[][]) => {
        let geoJsonObject: IGEOJson = {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [res]
          },
          properties: {
            name: 'Terrain'
          }
        };

        // if (this.colorScheme){
        //   for (let i = 0; i < geometry.faces.length; i += 2) {
        //     let color = [
        //       new Color(`rgb(${this.colorScheme[i / 2][0]}, ${this.colorScheme[i / 2][1]}, ${this.colorScheme[i / 2][2]})`),
        //       new Color(`rgb(${this.colorScheme[i / 2][0]}, ${this.colorScheme[i / 2][1]}, ${this.colorScheme[i / 2][2]})`),
        //       new Color(`rgb(${this.colorScheme[i / 2][0]}, ${this.colorScheme[i / 2][1]}, ${this.colorScheme[i / 2][2]})`)
        //     ];
        //
        //     geometry.faces[i].vertexColors = color;
        //     geometry.faces[i + 1].vertexColors = color;
        //
        //     // geometry.faces[i].color = new Color( 0xfff )
        //     //   .setRGB(this.colorScheme[i / 2][0], this.colorScheme[i / 2][1], this.colorScheme[i / 2][2])
        //
        //   }
        //   geometry.elementsNeedUpdate = true;
        // }

        let terrainMaterial = new MeshPhongMaterial({
          vertexColors: VertexColors,
          shininess: 0,
          color: 0x55aa55,
          flatShading: true
        });

        //TODO: пофиксить только квадратные картинки
        let terrain = new Terrain(img.width, 0.1, res);
        // terrain.generate(0.01);
        // let terrainObject = terrain.getTerrainWithMaterial(
        //   {
        //     isDungeon: options.isDungeon,
        //     rotationX: -Math.PI / 2
        //   },
        //   terrainMaterial
        // );

        let terrainGeometry = terrain.getTerrain({
          isDungeon: options.isDungeon,
          rotationX: -Math.PI / 2
        });

        // terrainGeometry,
        let terrainMesh = new Mesh(terrainGeometry, new MeshPhongMaterial({
          color: 0x3366aa,
          transparent: true,
          flatShading: true,
          opacity: 1
        }));

        terrainMesh.castShadow = true;
        terrainMesh.receiveShadow = true;

        // Нужно что бы не было траблов со светом
        terrainMesh.geometry.scale(environment.scale, environment.scale, environment.scale);

        // scene.add(terrainObject);

        let waterMaterial = new MeshPhongMaterial({
          color: 0x3366aa,
          transparent: true,
          flatShading: true,
          opacity: 0.8
        });

        // let waterMesh = terrain.getWaterWithMaterial(waterMaterial);
        // terrain.moveWaves(waterMesh);

        // scene.add(waterMesh);

        // !IMPORTANT TODO: add waves to water;
        // console.log(waterMesh);

        return {geoJson: geoJsonObject, terrain: terrainMesh};
      })
  }

  public sentMapToServer(promise){
    promise
      .then((obj) => {
        let options = { body: obj.geoJsonObject };

        return options.body
        // return new Api().points(options);
      })
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
      });
  }


  public changeColorMapFromImage(options, scene, img) {
    this.parseImageToColorGeo(img).then((res) => {
      console.log(res);
      this.colorScheme = res;
    });
  }

  //TODO: end

  /**
   * Парсим картину для создания карт высот
   * @param {HTMLImageElement} img
   * @returns {Promise<any>}
   */
  public parseImageToGeo(img: HTMLImageElement): Promise<number[][]> {
    return new Promise((resolve, reject) => {
      img.onload = () => {
        let data = this.getGeoHeight(img);
        resolve(data);
      };
    });
  }

  /**
   * Парсим картинку для замены цветов у фейсесов в хейтмапе
   * !ВАЖНО, должен быть одинаковый размер с parseImageToGeo
   * @param {HTMLImageElement} img
   * @returns {Promise<number[][]>}
   */
  public parseImageToColorGeo(img: HTMLImageElement): Promise<number[][]> {
    return new Promise((resolve, reject) => {
      img.onload = () => {
        let data = this.getColorMap(img);
        resolve(data);
      };
    });
  }

  /**
   *
   * @param {HTMLImageElement} img
   * @returns {number[][]}
   */
  public getGeoHeight(img: HTMLImageElement): number[][] {
    let canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;

    let context = canvas.getContext('2d');
    context.drawImage(img, 0, 0);

    let pix = context.getImageData(0, 0, img.width, img.height).data,
      coordinates = [];

    //+- (4) потому png в формате rgba.
    for (let i = 0, n = pix.length; i < n; i += 4) {
      coordinates.push([pix[i], pix[i + 1], pix[i + 2]]);
    }

    return coordinates;
  }

  //  TODO: change void

  /**
   * Получаем карту цветов
   * @param {HTMLImageElement} img
   * @returns {number[][]}
   */
  public getColorMap(img: HTMLImageElement): number[][] {
    let canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;

    let context = canvas.getContext('2d');
    context.drawImage(img, 0, 0);

    let pix = context.getImageData(0, 0, img.width - 1, img.height - 1).data,
      colorScheme = [];

    //+- (4) потому png в формате rgba.
    for (let i = 0, n = pix.length; i < n; i += 4) {
      colorScheme.push([pix[i], pix[i + 1], pix[i + 2]]);
    }

    return colorScheme;
  }
}
