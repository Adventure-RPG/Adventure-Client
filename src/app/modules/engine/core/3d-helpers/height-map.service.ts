import { Injectable } from '@angular/core';
import * as THREE from 'three';

import {IGEOJson} from "../../engine.types";
import {Color, Material, MeshBasicMaterial, MeshPhongMaterial, Object3D} from 'three';
import {createScope} from '@angular/core/src/profile/wtf_impl';



@Injectable()
export class HeightMapService {

  constructor() { }

  private colorScheme;
  private mapData;

  public changeMapFromImage(options, scene: THREE.Scene, img){

    // terrain
    //TODO: сделать добавление без рекваер
    //TODO: вынести, смерджить с настройками
    //TODO: вынести все текстуры и материалы в отдельный сервис

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


        let geometry = new THREE.PlaneGeometry(img.width, img.height, img.width - 1, img.height - 1);

        //Считаем по синему слою.
        for( let i = 0; i < res.length; i++ ){
          geometry.vertices[i].setZ(res[i][2] / 10);
        }

        console.log(res);

        geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2));
        geometry.verticesNeedUpdate = true;


        if (this.colorScheme){
          for (let i = 0; i < geometry.faces.length; i += 2) {
            let color = [
              new THREE.Color(`rgb(${this.colorScheme[i / 2][0]}, ${this.colorScheme[i / 2][1]}, ${this.colorScheme[i / 2][2]})`),
              new THREE.Color(`rgb(${this.colorScheme[i / 2][0]}, ${this.colorScheme[i / 2][1]}, ${this.colorScheme[i / 2][2]})`),
              new THREE.Color(`rgb(${this.colorScheme[i / 2][0]}, ${this.colorScheme[i / 2][1]}, ${this.colorScheme[i / 2][2]})`)
            ];

            geometry.faces[i].vertexColors = color;
            geometry.faces[i+1].vertexColors = color;

            // geometry.faces[i].color = new THREE.Color( 0xfff )
            //   .setRGB(this.colorScheme[i / 2][0], this.colorScheme[i / 2][1], this.colorScheme[i / 2][2])

          }
          geometry.elementsNeedUpdate = true;
        }


        // let material = new THREE.MeshBasicMaterial( {
        //     shading: THREE.FlatShading,
        //     vertexColors: THREE.VertexColors
        // });

        let material = new THREE.MeshPhongMaterial( {
          shading: THREE.FlatShading,
          vertexColors: THREE.VertexColors,
        } );

        let materialShadow = new THREE.ShadowMaterial( {
          opacity: 1,
          lineWidth: 0.1
        } );

        geometry.colorsNeedUpdate = true;


        console.log(this.colorScheme);
        console.log(geometry);

        let multiMaterial: any[] = [material];

        if (options.grid) {
          let loader = new THREE.TextureLoader();

          let textureRes = loader.load("assets/images/scene-ui-kit/graph-paper.svg");

          textureRes.wrapS = THREE.RepeatWrapping;
          textureRes.wrapT = THREE.RepeatWrapping;
          textureRes.repeat.set( (img.width - 1) / 10, (img.width - 1) / 10);

          let squadLinesMaterial = new THREE.MeshBasicMaterial( {
            map: textureRes,
            transparent: true,
            opacity: 0.1,
            color: 0x000000
          } );

          multiMaterial = [...multiMaterial, squadLinesMaterial];
        }

        let objectPG = THREE.SceneUtils.createMultiMaterialObject( geometry, multiMaterial );

        let parent = new THREE.Object3D();
        // if (options.gridAxis) {
        //   ////////////
        //   // CUSTOM //
        //   ////////////
        //
        //   let axes = new THREE.AxisHelper(1);
        //   let axesSize = img.width - 1;
        //   console.log(parent.position);
        //   // axes.position = parent.position;
        //   scene.add(axes);
        //
        //   let gridXZ = new THREE.GridHelper(axesSize, 100, new THREE.Color(0x006600), new THREE.Color(0x006600));
        //   gridXZ.position.set( axesSize / 2, axesSize / 2,axesSize / 2 );
        //   scene.add(gridXZ);
        //
        //   let gridXY = new THREE.GridHelper(axesSize, 100, new THREE.Color(0x000066), new THREE.Color(0x000066));
        //   gridXY.position.set( axesSize / 2, axesSize,0);
        //   gridXY.rotation.x = Math.PI / 2;
        //   scene.add(gridXY);
        //
        //   let gridYZ = new THREE.GridHelper(axesSize, 100, new THREE.Color(0x660000), new THREE.Color(0x660000));
        //   gridYZ.position.set( 0, axesSize, axesSize / 2 );
        //   gridYZ.rotation.z = Math.PI / 2;
        //
        //   console.log(gridXZ)
        //   scene.add(gridYZ);
        //
        // }

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
    console.log(img);
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
  public getGeoHeight(img: HTMLImageElement):Array<Array<number>> {
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
  public getColorMap(img: HTMLImageElement): any {
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

  public getHeightMap(scene: THREE.Scene){
    let light = new THREE.Color( 0xffffff );
    let shadow = new THREE.Color( 0x505050 );
    let matrix = new THREE.Matrix4();

    //TODO: переделать от картинки
    let worldDepth = 20;
    let worldWidth = 20;
    let worldHalfWidth = worldWidth / 2, worldHalfDepth = worldDepth / 2;
    let colors;
    this.generateHeight(worldWidth, worldDepth);

    let pxGeometry = new THREE.PlaneGeometry( 100, 100 );
    pxGeometry.faces[ 0 ].vertexColors = [ light, shadow, light ];
    pxGeometry.faces[ 1 ].vertexColors = [ shadow, shadow, light ];
    pxGeometry.faceVertexUvs[ 0 ][ 0 ][ 0 ].y = 0.5;
    pxGeometry.faceVertexUvs[ 0 ][ 0 ][ 2 ].y = 0.5;
    pxGeometry.faceVertexUvs[ 0 ][ 1 ][ 2 ].y = 0.5;
    pxGeometry.rotateY( Math.PI / 2 );
    pxGeometry.translate( 50, 0, 0 );

    let nxGeometry = new THREE.PlaneGeometry( 100, 100 );
    nxGeometry.faces[ 0 ].vertexColors = [ light, shadow, light ];
    nxGeometry.faces[ 1 ].vertexColors = [ shadow, shadow, light ];
    nxGeometry.faceVertexUvs[ 0 ][ 0 ][ 0 ].y = 0.5;
    nxGeometry.faceVertexUvs[ 0 ][ 0 ][ 2 ].y = 0.5;
    nxGeometry.faceVertexUvs[ 0 ][ 1 ][ 2 ].y = 0.5;
    nxGeometry.rotateY( - Math.PI / 2 );
    nxGeometry.translate( - 50, 0, 0 );

    let pyGeometry = new THREE.PlaneGeometry( 100, 100 );
    pyGeometry.faces[ 0 ].vertexColors = [ light, light, light ];
    pyGeometry.faces[ 1 ].vertexColors = [ light, light, light ];
    pyGeometry.faceVertexUvs[ 0 ][ 0 ][ 1 ].y = 0.5;
    pyGeometry.faceVertexUvs[ 0 ][ 1 ][ 0 ].y = 0.5;
    pyGeometry.faceVertexUvs[ 0 ][ 1 ][ 1 ].y = 0.5;
    pyGeometry.rotateX( - Math.PI / 2 );
    pyGeometry.translate( 0, 50, 0 );

    let py2Geometry = new THREE.PlaneGeometry( 100, 100 );
    py2Geometry.faces[ 0 ].vertexColors = [ light, light, light ];
    py2Geometry.faces[ 1 ].vertexColors = [ light, light, light ];
    py2Geometry.faceVertexUvs[ 0 ][ 0 ][ 1 ].y = 0.5;
    py2Geometry.faceVertexUvs[ 0 ][ 1 ][ 0 ].y = 0.5;
    py2Geometry.faceVertexUvs[ 0 ][ 1 ][ 1 ].y = 0.5;
    py2Geometry.rotateX( - Math.PI / 2 );
    py2Geometry.rotateY( Math.PI / 2 );
    py2Geometry.translate( 0, 50, 0 );

    let pzGeometry = new THREE.PlaneGeometry(100, 100 );
    pzGeometry.faces[ 0 ].vertexColors = [ light, shadow, light ];
    pzGeometry.faces[ 1 ].vertexColors = [ shadow, shadow, light ];
    pzGeometry.faceVertexUvs[ 0 ][ 0 ][ 0 ].y = 0.5;
    pzGeometry.faceVertexUvs[ 0 ][ 0 ][ 2 ].y = 0.5;
    pzGeometry.faceVertexUvs[ 0 ][ 1 ][ 2 ].y = 0.5;
    pzGeometry.translate( 0, 0, 50 );

    let nzGeometry = new THREE.PlaneGeometry( 100, 100 );
    nzGeometry.faces[ 0 ].vertexColors = [ light, shadow, light ];
    nzGeometry.faces[ 1 ].vertexColors = [ shadow, shadow, light ];
    nzGeometry.faceVertexUvs[ 0 ][ 0 ][ 0 ].y = 0.5;
    nzGeometry.faceVertexUvs[ 0 ][ 0 ][ 2 ].y = 0.5;
    nzGeometry.faceVertexUvs[ 0 ][ 1 ][ 2 ].y = 0.5;
    nzGeometry.rotateY( Math.PI );
    nzGeometry.translate( 0, 0, - 50 );

    let geometry = new THREE.Geometry();
    let dummy = new THREE.Mesh();

    for ( let z = 0; z < worldDepth; z ++ ) {
      for ( let x = 0; x < worldWidth; x ++ ) {

        let h = this.getY( x, z, worldWidth );

        matrix.makeTranslation(
          x * 10- worldHalfWidth * 10,
          h * 10,
          z * 10 - worldHalfDepth * 10
        );

        let px   = this.getY( x + 1, z, worldWidth );
        let nx   = this.getY( x - 1, z, worldWidth );
        let pz   = this.getY( x, z + 1, worldWidth );
        let nz   = this.getY( x, z - 1, worldWidth );

        let pxpz = this.getY( x + 1, z + 1, worldWidth );
        let nxpz = this.getY( x - 1, z + 1, worldWidth );
        let pxnz = this.getY( x + 1, z - 1, worldWidth );
        let nxnz = this.getY( x - 1, z - 1, worldWidth );

        let a = nx > h || nz > h || nxnz > h ? 0 : 1;
        let b = nx > h || pz > h || nxpz > h ? 0 : 1;
        let c = px > h || pz > h || pxpz > h ? 0 : 1;
        let d = px > h || nz > h || pxnz > h ? 0 : 1;

        if ( a + c > b + d ) {

          colors = py2Geometry.faces[ 0 ].vertexColors;

          colors[ 0 ] = b === 0 ? shadow : light;
          colors[ 1 ] = c === 0 ? shadow : light;
          colors[ 2 ] = a === 0 ? shadow : light;

          colors = py2Geometry.faces[ 1 ].vertexColors;

          colors[ 0 ] = c === 0 ? shadow : light;
          colors[ 1 ] = d === 0 ? shadow : light;
          colors[ 2 ] = a === 0 ? shadow : light;

          geometry.merge( py2Geometry, matrix );

        } else {

          colors = pyGeometry.faces[ 0 ].vertexColors;

          colors[ 0 ] = a === 0 ? shadow : light;
          colors[ 1 ] = b === 0 ? shadow : light;
          colors[ 2 ] = d === 0 ? shadow : light;

          colors = pyGeometry.faces[ 1 ].vertexColors;

          colors[ 0 ] = b === 0 ? shadow : light;
          colors[ 1 ] = c === 0 ? shadow : light;
          colors[ 2 ] = d === 0 ? shadow : light;

          geometry.merge( pyGeometry, matrix );

        }

        if ( ( px != h && px != h + 1 ) || x == 0 ) {

          colors = pxGeometry.faces[ 0 ].vertexColors;

          colors[ 0 ] = pxpz > px && x > 0 ? shadow : light;
          colors[ 2 ] = pxnz > px && x > 0 ? shadow : light;

          colors = pxGeometry.faces[ 1 ].vertexColors;

          colors[ 2 ] = pxnz > px && x > 0 ? shadow : light;

          geometry.merge( pxGeometry, matrix );

        }

        if ( ( nx != h && nx != h + 1 ) || x == worldWidth - 1 ) {

          colors = nxGeometry.faces[ 0 ].vertexColors;

          colors[ 0 ] = nxnz > nx && x < worldWidth - 1 ? shadow : light;
          colors[ 2 ] = nxpz > nx && x < worldWidth - 1 ? shadow : light;

          colors = nxGeometry.faces[ 1 ].vertexColors;

          colors[ 2 ] = nxpz > nx && x < worldWidth - 1 ? shadow : light;

          geometry.merge( nxGeometry, matrix );

        }

        if ( ( pz != h && pz != h + 1 ) || z == worldDepth - 1 ) {

          colors = pzGeometry.faces[ 0 ].vertexColors;

          colors[ 0 ] = nxpz > pz && z < worldDepth - 1 ? shadow : light;
          colors[ 2 ] = pxpz > pz && z < worldDepth - 1 ? shadow : light;

          colors = pzGeometry.faces[ 1 ].vertexColors;

          colors[ 2 ] = pxpz > pz && z < worldDepth - 1 ? shadow : light;

          geometry.merge( pzGeometry, matrix );

        }

        if ( ( nz != h && nz != h + 1 ) || z == 0 ) {

          colors = nzGeometry.faces[ 0 ].vertexColors;

          colors[ 0 ] = pxnz > nz && z > 0 ? shadow : light;
          colors[ 2 ] = nxnz > nz && z > 0 ? shadow : light;

          colors = nzGeometry.faces[ 1 ].vertexColors;

          colors[ 2 ] = nxnz > nz && z > 0 ? shadow : light;

          geometry.merge( nzGeometry, matrix );

        }
      }
    }


    // let texture = new THREE.TextureLoader().load( 'assets/images/heightmap/atlas.png' );
    // texture.magFilter = THREE.NearestFilter;
    // texture.minFilter = THREE.LinearMipMapLinearFilter;

    console.log(geometry)

    let mesh = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: 0xffffff, vertexColors: THREE.VertexColors } ) );
    scene.add( mesh );
  }

  getY( x, z, worldWidth ) {
    return ( this.mapData[ x + z * worldWidth ] * 0.2 ) | 0;
  }

  improvedNoise() {

    let p = [ 151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,
      23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,88,237,149,56,87,
      174,20,125,136,171,168,68,175,74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,
      133,230,220,105,92,41,55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,
      89,18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,250,124,123,5,
      202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,223,183,170,213,119,
      248,152,2,44,154,163,70,221,153,101,155,167,43,172,9,129,22,39,253,19,98,108,110,79,113,224,232,
      178,185,112,104,218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,
      14,239,107,49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,138,236,205,
      93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180 ];

    for (let i = 0; i < 256 ; i ++) {

      p[256 + i] = p[i];

    }

    function fade(t) {

      return t * t * t * (t * (t * 6 - 15) + 10);

    }

    function lerp(t, a, b) {

      return a + t * (b - a);

    }

    function grad(hash, x, y, z) {

      let h = hash & 15;
      let u = h < 8 ? x : y, v = h < 4 ? y : h == 12 || h == 14 ? x : z;
      return ((h&1) == 0 ? u : -u) + ((h&2) == 0 ? v : -v);

    }

    return {

      noise: function (x, y, z) {

        let floorX = Math.floor(x), floorY = Math.floor(y), floorZ = Math.floor(z);

        let X = floorX & 255, Y = floorY & 255, Z = floorZ & 255;

        x -= floorX;
        y -= floorY;
        z -= floorZ;

        let xMinus1 = x - 1, yMinus1 = y - 1, zMinus1 = z - 1;

        let u = fade(x), v = fade(y), w = fade(z);

        let A = p[X] + Y, AA = p[A] + Z, AB = p[A + 1] + Z, B = p[X + 1] + Y, BA = p[B] + Z, BB = p[B + 1] + Z;

        return lerp(w, lerp(v, lerp(u, grad(p[AA], x, y, z),
          grad(p[BA], xMinus1, y, z)),
          lerp(u, grad(p[AB], x, yMinus1, z),
            grad(p[BB], xMinus1, yMinus1, z))),
          lerp(v, lerp(u, grad(p[AA + 1], x, y, zMinus1),
            grad(p[BA + 1], xMinus1, y, z - 1)),
            lerp(u, grad(p[AB + 1], x, yMinus1, zMinus1),
              grad(p[BB + 1], xMinus1, yMinus1, zMinus1))));

      }
    }
  }

  generateHeight( width, height ) {
    this.mapData = [];
    //TODO: чек нужен ли new перед improved noise
    let perlin = this.improvedNoise(),
      size = width * height, quality = 2, z = Math.random() * 100;
    for ( let j = 0; j < 4; j ++ ) {
      if ( j == 0 ) for ( let i = 0; i < size; i ++ ) this.mapData[ i ] = 0;
      for ( let i = 0; i < size; i ++ ) {
        let x = i % width, y = ( i / width ) | 0;
        this.mapData[ i ] += perlin.noise( x / quality, y / quality, z ) * quality;
      }
      quality *= 4
    }
    return this.mapData;
  }
}
