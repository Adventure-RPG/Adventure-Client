import { Injectable } from '@angular/core';

import { IGEOJson } from '../../engine.types';
import { Mesh, MeshPhongMaterial, Scene, ShadowMaterial, VertexColors } from 'three';
import { Terrain } from '../utils/terrain';
import { Noise } from '@modules/engine/core/utils/noise';
import { fromCSG, toCSG } from 'three-2-csg';

const csgApi = require('@jscad/csg');

// import * as SimplexNoise from 'simplex-noise';

@Injectable()
export class HeightMapService {
  private colorScheme;
  private mapData;

  constructor() {}

  //TODO: пустить параллельно

  public changeMapFromImage(options, scene: Scene, img) {
    // terrain
    //TODO: сделать добавление без рекваер
    //TODO: вынести, смерджить с настройками
    //TODO: вынести все текстуры и материалы в отдельный сервис

    return this.parseImageToGeo(img)
      .then(res => {
        let geoJsonObject: IGEOJson = {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [res]
          },
          properties: {
            name: 'Ocean'
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

        let terrain = new Terrain(img.width, 0.1, res);
        // terrain.generate(0.01);
        let terrainObject = terrain.getTerrainWithMaterial({
          isDungeon: true
        }, terrainMaterial);
        terrainObject.castShadow = true;
        terrainObject.receiveShadow = true;
        scene.add(terrainObject);

        let waterMaterial = new MeshPhongMaterial({
          color: 0x3366aa,
          transparent: true,
          flatShading: true,
          opacity: 0.8
        });

        let waterMesh = terrain.getWaterWithMaterial(waterMaterial);
        terrain.moveWaves(waterMesh);

        scene.add(waterMesh);

        // !IMPORTANT TODO: add waves to water;
        console.log(waterMesh);

        return geoJsonObject;
      })
      .then(geoObj => {
        let options = { body: geoObj };
        // return new Api().points(options);
      })
      .then(response => {
        console.log(response);
      })
      .catch(err => {
        console.log(err);
      });
  }

  public changeColorMapFromImage(options, scene, img) {
    this.parseImageToColorGeo(img).then(res => {
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

  /**
   * Experimental
   * Нужна для создания террейна с вертикальными стенами. Пока генерируется без картинки
   * @param {Scene} scene
   */
  public generateDungeonTerrain(scene: Scene) {
    //TODO: переделать от картинки
    //ВАЖНО: Должно быть кратно 4ём, не кратное 4ём не проверял
    let worldDepth = 16;
    let worldWidth = 16;
    let cubeWidth = 1;

    this.mapData = Noise.generateHeight(worldWidth, worldDepth);

    //Нужен для перемещения в 0
    const min = Math.min(...this.mapData) * 0.2;

    let geometries = [];

    for (let z = 0; z < worldDepth; z++) {
      for (let x = 0; x < worldWidth; x++) {
        //ВАЖНО! Подумать в сторону кастомных алгоритмов по объеденению
        //http://evanw.github.io/csg.js/docs/

        //Делаем всех от одного уровня
        let h = Noise.getY({ mapData: this.mapData, x, z, worldWidth, k: 0.2 });

        // x - worldHalfWidth
        // z - worldHalfDepth
        let diff = h - min;
        let hres;
        diff >= 1 ? hres = diff : hres = 1;

        geometries.push(
          csgApi.CSG.cube({
            radius: [cubeWidth / 2, hres, cubeWidth / 2],
            center: [x * cubeWidth, 0, z * cubeWidth]
          })
        );
      }
    }

    // geometries.push(
    //   csgApi.CSG.cube({
    //     radius: cubeWidth/2,
    //     center: [0, 0, 0],
    //   })
    // );
    //
    // geometries.push(
    //   csgApi.CSG.cube({
    //     radius: cubeWidth/2,
    //     center: [0, 0, 1],
    //   })
    // );

    console.log(geometries);

    let csgModel = geometries[0];

    // console.log(arrayTest);
    console.time('merge geometries')
    for (let i = 0; i < geometries.length; i++) {
      csgModel = csgModel.union(geometries[i]);
    }
    console.timeEnd('merge geometries');

    //TODO: Вынести материалы и нижнию логику
    let shadowMaterial = new ShadowMaterial({
      opacity: 0.9
    });
    // console.log(geometry)

    let material = new MeshPhongMaterial({
      flatShading: true,
      shininess: 100,
      vertexColors: VertexColors,
      color: '#89ff90'
    });

    let mesh = new Mesh(fromCSG(csgModel), [material, shadowMaterial]);
    mesh.geometry.computeVertexNormals();
    //
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.updateMatrix();
    scene.add(mesh);
  }
}
