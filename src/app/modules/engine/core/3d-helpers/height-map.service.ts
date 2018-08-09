import { Injectable } from '@angular/core';

import { IGEOJson } from '../../engine.types';
import {
  BoxGeometry,
  Geometry,
  Matrix4,
  Mesh,
  MeshLambertMaterial,
  MeshPhongMaterial,
  Scene,
  ShadowMaterial,
  Vector3,
  VertexColors
} from 'three';
import { Terrain } from '../utils/terrain';
import {Noise} from "@modules/engine/core/utils/noise";

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
        let terrainObject = terrain.getTerrainWithMaterial(terrainMaterial);
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
    this.parseImageToColorGeo(img)
      .then(res => {
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
    let worldHalfWidth = worldWidth / 2,
      worldHalfDepth = worldDepth / 2;

    this.mapData = Noise.generateHeight(worldWidth, worldDepth);
    let matrix = new Matrix4();

    let geometry = new Geometry();

    let boxGeometry = new BoxGeometry(cubeWidth, cubeWidth, cubeWidth);

    //Нужен для перемещения в 0
    const min = Math.min(...this.mapData) * 0.2;

    // console.log(min);
    let geometryMatrix: Array<Vector3> = [];

    for (let z = 0; z < worldDepth; z++) {
      for (let x = 0; x < worldWidth; x++) {
        //Делаем всех от одного уровня
        let h = Noise.getY({mapData: this.mapData, x, z, worldWidth, k: 0.2});

        console.log(h);

        for (let y = min; y <= h + 2; y++) {
          matrix.makeTranslation(
            x * cubeWidth - worldHalfWidth * cubeWidth,
            (y - min) * cubeWidth,
            z * cubeWidth - worldHalfDepth * cubeWidth
          );

          geometry.merge(boxGeometry, matrix);
        }

        // x - worldHalfWidth
        // z - worldHalfDepth
      }
    }

    // let index = 0;
    // for (let obj of geometryMatrix) {
    //   geometry.faces.push(new Face3(index, index+1, index+2));
    //   geometry.vertices.push(obj);
    //
    //   index++;
    // }
    //
    // console.log(geometryMatrix)
    // console.log(geometry)

    geometry.computeFaceNormals();
    geometry.computeVertexNormals();

    //TODO: Вынести материалы и нижнию логику

    let material = new MeshLambertMaterial({
      color: Math.random() * 0xffffff
    });

    let baseMaterial = new MeshLambertMaterial({
      flatShading: true,
      vertexColors: VertexColors,
      color: '#fff'
    });

    let shadowMaterial = new ShadowMaterial({
      opacity: 0.2
    });
    // console.log(geometry)

    geometry.verticesNeedUpdate = true;
    // geometry.computeFlatVertexNormals();
    // geometry.computeFaceNormals();
    // geometry.computeBoundingSphere();
    // geometry.computeBoundingBox();
    geometry.mergeVertices();

    let mesh = new Mesh(geometry, material);
    //
    // console.log(geometry);
    //
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.updateMatrix();
    // //
    scene.add(mesh);
    //
    //
    // let geometry2 = new PlaneGeometry(10000,10000,1,1);
    // let material2 = new MeshLambertMaterial( {color: 0x00ee00} );
    // let plane2 = new Mesh( geometry2, material2 );
    // plane2.receiveShadow = true;
    // plane2.castShadow = true;
    // plane2.rotation.x = -Math.PI / 2;
    // plane2.position.y = -21;
    // scene.add( plane2 );
    //
    //
    // //SPHERE
    // let geometry3 = new SphereGeometry(20, 12, 12);
    // let material3 = new MeshLambertMaterial({color: 0xffffff, vertexColors: FaceColors});
    // for (let i = 0; i < geometry3.faces.length; i++) {
    //   geometry3.faces[i].color.setRGB(Math.random(),Math.random(),Math.random());
    // }
    // let mesh3 = new Mesh(geometry3,material3);
    //
    // mesh3.position.y = 30;
    // mesh3.position.z = 50;
    // mesh3.receiveShadow = true;
    // mesh3.castShadow = true;
    //
    // scene.add(mesh3);
  }

  public generateDungeonTerrain2(scene: Scene) {
    //TODO: переделать от картинки
    //ВАЖНО: Должно быть кратно 4ём, не кратное 4ём не проверял
    let worldDepth = 10;
    let worldWidth = 10;
    let cubeWidth = 1;
    let worldHalfWidth = worldWidth / 2,
      worldHalfDepth = worldDepth / 2;

    this.mapData = Noise.generateHeight(worldWidth, worldDepth);
    // let matrix = new Matrix4();
    // let geometry = new Geometry();
    // let boxGeometry = new BoxGeometry(cubeWidth, cubeWidth, cubeWidth);

    // //Нужен для перемещения в 0
    const min = Math.min(...this.mapData) * 0.2;

    // console.log(min);
    // let geometryMatrix: Array<Vector3> = [];

    let xMax = 0;
    let zMax = 0;
    let x = 0;
    let z = 0;
    let rectangle;
    let rectangles = [];

    let RECT_SIZE = 1,
      RECT_HEIGHT = 10,
      GRID_SIZE = 10;
    let NUM_CUBES = GRID_SIZE * GRID_SIZE;

    let geometry = new BoxGeometry(RECT_SIZE, RECT_HEIGHT, RECT_SIZE);

    for (let i = 0; i < NUM_CUBES; i++) {
      let material = new MeshLambertMaterial({
        color: Math.random() * 0xffffff
      });

      if (i % GRID_SIZE === 0) {
        z = 1;
        x++;
      } else {
        z++;
      }

      let h = Noise.getY({mapData: this.mapData, x, z, worldWidth, k: 0.2});

      xMax = -((GRID_SIZE * RECT_SIZE) / 2 - RECT_SIZE * z + RECT_SIZE / 2);
      zMax = (GRID_SIZE * RECT_SIZE) / 2 - RECT_SIZE * x + RECT_SIZE / 2;

      // повто
      // for ( let y = min; y <= h + 2; y ++ ) {
      //
      //   matrix.makeTranslation(
      //     x * cubeWidth - worldHalfWidth * cubeWidth,
      //     (y - min) * cubeWidth,
      //     z * cubeWidth - worldHalfDepth * cubeWidth
      //   );
      //
      //   geometry.merge(boxGeometry, matrix);
      //
      // }

      console.log(`${xMax}:${zMax} - ${h}`);

      rectangle = new Mesh(geometry, material);
      rectangle.position.set(xMax, h - min, zMax);
      rectangle.castShadow = true;
      rectangle.receiveShadow = true;
      rectangles.push(rectangle);

      scene.add(rectangle);
    }
  }

  /**
   * Удалить, если не понадобится
   */
  // public getHeightMap(scene: Scene){
  //
  //   //TODO: переделать от картинки
  //   //ВАЖНО: Должно быть кратно 4ём, не кратное 4ём не проверял
  //   let worldDepth = 200;
  //   let worldWidth = 200;
  //   let cubeWidth = 1;
  //   let worldHalfWidth = worldWidth / 2, worldHalfDepth = worldDepth / 2;
  //
  //   this.mapData = Noise.generateHeight(worldWidth, worldDepth);
  //
  //   let light = new Color( 0xffffff );
  //   let matrix = new Matrix4();
  //
  //   let pxGeometry = new PlaneGeometry( cubeWidth, cubeWidth );
  //   pxGeometry.rotateY( Math.PI / 2 );
  //   pxGeometry.translate( cubeWidth / 2, 0, 0 );
  //
  //   let nxGeometry = new PlaneGeometry( cubeWidth, cubeWidth );
  //   nxGeometry.rotateY( - Math.PI / 2 );
  //   nxGeometry.translate( - cubeWidth / 2, 0, 0 );
  //
  //   let pyGeometry = new PlaneGeometry( cubeWidth, cubeWidth );
  //   pyGeometry.rotateX( - Math.PI / 2 );
  //   pyGeometry.translate( 0, cubeWidth / 2, 0 );
  //
  //   let py2Geometry = new PlaneGeometry( cubeWidth, cubeWidth );
  //   py2Geometry.rotateX( - Math.PI / 2 );
  //   py2Geometry.rotateY( Math.PI / 2 );
  //   py2Geometry.translate( 0, cubeWidth / 2, 0 );
  //
  //
  //   let pzGeometry = new PlaneGeometry(cubeWidth, cubeWidth );
  //   pzGeometry.translate( 0, 0, cubeWidth / 2 );
  //
  //   let nzGeometry = new PlaneGeometry( cubeWidth, cubeWidth );
  //   nzGeometry.rotateY( Math.PI );
  //   nzGeometry.translate( 0, 0, - cubeWidth / 2 );
  //
  //   let geometry = new Geometry();
  //
  //   // Проход выставления высоты каждому квадрату
  //   for ( let z = 0; z < worldDepth; z ++ ) {
  //     for ( let x = 0; x < worldWidth; x ++ ) {
  //
  //       let h = Noise.getY( x, z, worldWidth );
  //
  //       // x - worldHalfWidth
  //       // z - worldHalfDepth
  //
  //       matrix.makeTranslation(
  //         x * cubeWidth - worldHalfWidth * cubeWidth,
  //         h * cubeWidth,
  //         z * cubeWidth - worldHalfDepth * cubeWidth
  //       );
  //
  //
  //       /**
  //        * 0 1 0
  //        * 1 X 1
  //        * 0 1 0
  //        *
  //        * 1 - nx, px, pz, nz
  //        * 0 - pxpz, nxpz, pxnz, nxnz
  //        * X - current point
  //        * @type {number}
  //        */
  //
  //       //Проверка высоты соседних элементов
  //       let px   = Noise.getY( x + 1, z, worldWidth );
  //       let nx   = Noise.getY( x - 1, z, worldWidth );
  //       let pz   = Noise.getY( x, z + 1, worldWidth );
  //       let nz   = Noise.getY( x, z - 1, worldWidth );
  //
  //       let pxpz = Noise.getY( x + 1, z + 1, worldWidth );
  //       let nxpz = Noise.getY( x - 1, z + 1, worldWidth );
  //       let pxnz = Noise.getY( x + 1, z - 1, worldWidth );
  //       let nxnz = Noise.getY( x - 1, z - 1, worldWidth );
  //
  //       let a = nx > h || nz > h || nxnz > h ? 0 : 1;
  //       let b = nx > h || pz > h || nxpz > h ? 0 : 1;
  //       let c = px > h || pz > h || pxpz > h ? 0 : 1;
  //       let d = px > h || nz > h || pxnz > h ? 0 : 1;
  //
  //       // console.log(`
  //       //   ${z*worldWidth+x}: x, z, y: ${x} ${z} ${h}
  //       // `);
  //
  //
  //       if ( a + c > b + d ) {
  //         geometry.merge(py2Geometry, matrix);
  //       } else {
  //         geometry.merge( pyGeometry, matrix );
  //       }
  //
  //       if ( ( px != h && px != h + 1 ) || x == 0 ) {
  //         geometry.merge( pxGeometry, matrix );
  //       }
  //
  //       if ( ( nx != h && nx != h + 1 ) || x == worldWidth - 1 ) {
  //         geometry.merge( nxGeometry, matrix );
  //       }
  //
  //       if ( ( pz != h && pz != h + 1 ) || z == worldDepth - 1 ) {
  //         geometry.merge( pzGeometry, matrix );
  //       }
  //
  //       if ( ( nz != h && nz != h + 1 ) || z == 0 ) {
  //         geometry.merge( nzGeometry, matrix );
  //       }
  //     }
  //   }
  //
  //
  //
  //   let material = new MeshPhongMaterial( {
  //     flatShading: true,
  //     vertexColors: VertexColors,
  //     side: DoubleSide
  //   } );
  //
  //   console.log(geometry);
  //
  //   geometry.verticesNeedUpdate = true;
  //
  //   let mesh = new Mesh( geometry, material );
  //
  //   mesh.castShadow = true;
  //   mesh.receiveShadow = true;
  //
  //   scene.add( mesh );
  // }

}
