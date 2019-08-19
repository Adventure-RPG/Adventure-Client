import { Injectable } from '@angular/core';

import { IGEOJson } from '../../engine.types';
import {
  BoxGeometry, DoubleSide, FaceNormalsHelper, Geometry, Matrix4, Mesh, MeshNormalMaterial, MeshPhongMaterial, Scene,
  ShadowMaterial,
  VertexColors
} from 'three';
import { Terrain } from '../utils/terrain';
import { Noise } from '@modules/engine/core/utils/noise';

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
      .then((res) => {
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

        let terrain = new Terrain(img.width, 0.1, res);
        // terrain.generate(0.01);
        let terrainObject = terrain.getTerrainWithMaterial(
          {
            isDungeon: false,
            rotationX: Math.PI / 2
          },
          terrainMaterial
        );
        terrainObject.castShadow = true;
        terrainObject.receiveShadow = true;
        scene.add(terrainObject);

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

        return geoJsonObject;
      })
      .then((geoObj) => {
        let options = { body: geoObj };
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

  /**
   * Experimental
   * Нужна для создания террейна с вертикальными стенами. Пока генерируется без картинки
   * @param {Scene} scene
   */
  public generateDungeonTerrain(scene: Scene) {
    //TODO: переделать от картинки
    //ВАЖНО: Должно быть кратно 4ём, не кратное 4ём не проверял
    let worldWidth = 32,
        worldDepth = 32,
        worldHalfWidth = worldWidth / 2,
        worldHalfDepth = worldDepth / 2,
        cubeWidth = 1;

    let matrix = new Matrix4();

    this.mapData = Noise.generateHeight(worldWidth, worldDepth);

    let geometry = new Geometry();
    let boxGeometry = new BoxGeometry(cubeWidth, cubeWidth, cubeWidth);

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
        diff >= 1 ? (hres = diff) : (hres = 1);

        for (let y = min; y <= h + 2; y++) {
          matrix.makeTranslation(
            x * cubeWidth - worldHalfWidth * cubeWidth,
            y,
            z * cubeWidth - worldHalfDepth * cubeWidth
          );
          geometry.merge(boxGeometry, matrix);
        }

      }
    }


    geometry.computeFaceNormals();
    geometry.computeVertexNormals();
    geometry.computeFlatVertexNormals();

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

    let meshNormalMaterial: MeshNormalMaterial = new MeshNormalMaterial({

    });

    let mesh = new Mesh( geometry, [material, meshNormalMaterial] );

    // mesh.geometry.computeFaceNormals();
    // mesh.geometry.computeVertexNormals();
    // //

    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.updateMatrix();
    scene.add(mesh);

    let helper = new FaceNormalsHelper( mesh, 2, 0x00ff00, 1 );
    scene.add(helper);

  }
}
