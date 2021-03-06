import {
  BoxGeometry, ExtrudeGeometry, Geometry, Material, Matrix4, Mesh, MeshNormalMaterial, MeshPhongMaterial, PlaneGeometry,
  ShadowMaterial,
  Shape, ShapeGeometry,
  TangentSpaceNormalMap, Vector2,
  VertexColors
} from 'three';
import { environment } from "../../../../../environments/environment";
import { Noise } from "@modules/engine/core/utils/noise";
import { Path } from "three/src/extras/core/Path";
import * as Lodash from 'lodash';

export enum WallType {
  isSteps,
  isDungeon,
  isPolygon
}

export interface TerrainOptions {
  wallType: WallType;
  rotationX: number;
}

export interface MatrixCoordinate  {
  x: number,
  y: number,
  hole: boolean,
  index: number,
  shapeName?: string
}

enum VectorDirection {
  Right,
  Down,
  Left,
  Up
}

export class Terrain {
  size: number;
  max: number;
  mapEx = {min: 255, max: 0};
  map;
  waves;
  scaleZ = 1;

  constructor(size, scaleZ, map: number[][]) {
    this.size = size;
    console.log(this.size);
    this.max = this.size - 1;
    this.scaleZ = scaleZ;
    // this.map = map;

    if (map) {
      this.map = [];
      map.forEach((value: number[], index: number) => {
        this.map.push(value[2] * this.scaleZ);
      });
    } else {
      this.map = new Float32Array(this.size * this.size);
    }

    for (let i = 1; i < this.map.length; ++i) {
      if (this.map[i] > this.mapEx.max) {
        this.mapEx.max = this.map[i];
      }
    }
    console.log(this.map);

    for (let i = 1; i < this.map.length; ++i) {
      if (this.map[i] < this.mapEx.min) {
        this.mapEx.min = this.map[i];
      }
    }
    console.log(this.mapEx);

  }

  get(x, y) {
    if (x < 0 || x > this.max || y < 0 || y > this.max) {
      return -1;
    }
    return this.map[x + this.size * y];
  }

  set(x, y, val) {
    this.map[x + this.size * y] = val;
  }

  generate(roughness) {
    let diamond = (x, y, size, offset) => {
      let ave = average([
        this.get(x, y - size), // top
        this.get(x + size, y), // right
        this.get(x, y + size), // bottom
        this.get(x - size, y) // left
      ]);
      this.set(x, y, ave + offset);
    };

    let divide = (size) => {
      let x,
        y,
        half = size / 2;
      let scale = roughness * size;
      if (half < 1) {
        return;
      }

      for (y = half; y < this.max; y += size) {
        for (x = half; x < this.max; x += size) {
          square(x, y, half, Math.random() * scale * 2 - scale);
        }
      }
      for (y = 0; y <= this.max; y += half) {
        for (x = (y + half) % size; x <= this.max; x += size) {
          diamond(x, y, half, Math.random() * scale * 2 - scale);
        }
      }
      divide(size / 2);
    };

    let average = (values) => {
      let valid = values.filter(function(val) {
        return val !== -1;
      });
      let total = valid.reduce(function(sum, val) {
        return sum + val;
      }, 0);
      return total / valid.length;
    };

    let square = (x, y, size, offset) => {
      let ave = average([
        this.get(x - size, y - size), // upper left
        this.get(x + size, y - size), // upper right
        this.get(x + size, y + size), // lower right
        this.get(x - size, y + size) // lower left
      ]);
      this.set(x, y, ave + offset);
    };

    this.set(0, 0, this.max);
    this.set(this.max, 0, this.max / 2);
    this.set(this.max, this.max, 0);
    this.set(0, this.max, this.max / 2);

    divide(this.max);
  }

  getTerrain(terrainOptions: TerrainOptions): PlaneGeometry | Geometry {

    if (terrainOptions.wallType === WallType.isDungeon) {
      console.log('♦ Dungeon ♦');
      return this.generateDungeonTerrain();
    } else if (terrainOptions.wallType === WallType.isSteps){
      console.log('♦ Step ♦');
      return this.generateStepTerrain();
    } else {
      //WallType.isPolygon
      console.log('♦ Plane ♦');
      return this.generatePlaneTerrain();
    }

  }

  /**
   * Experimental
   * Нужна для создания террейна с вертикальными стенами. Пока генерируется без картинки
   */
  public generateDungeonTerrain(): Geometry {
    //TODO: переделать от картинки
    //ВАЖНО: Должно быть кратно 4ём, не кратное 4ём не проверял
    let worldWidth = this.size,
      worldDepth = this.size,
      worldHalfWidth = this.size / 2,
      worldHalfDepth = this.size / 2,
      cubeWidth = 1;

    let matrix = new Matrix4();

    // this.mapData = Noise.generateHeight(worldWidth, worldDepth);

    let geometry = new Geometry();
    let boxGeometry = new BoxGeometry(cubeWidth, cubeWidth, cubeWidth);


    // console.log('processing');
    console.time("allLayers");
    for (let z = 0; z < worldDepth; z++) {
      console.time("layers");
      for (let x = 0; x < worldWidth; x++) {
        //ВАЖНО! Подумать в сторону кастомных алгоритмов по объеденению
        //http://evanw.github.io/csg.js/docs/

        //Делаем всех от одного уровня
        // let h = Noise.getY({ mapData: this.map, x, z, worldWidth, k: 0.2 });
        let h = this.get(x, z);

        // x - worldHalfWidth
        // z - worldHalfDepth
        let diff = h - this.mapEx.min;
        let hres;
        diff >= 1 ? (hres = diff) : (hres = 1);

        // console.log(h);
        // console.log(diff);

        for (let y = this.mapEx.min; y <= h; y++) {
          matrix.makeTranslation(
            x * cubeWidth,
            (y - this.mapEx.min) * cubeWidth + 0.5 * cubeWidth,
            z * cubeWidth
          );
          geometry.merge(boxGeometry, matrix);
        }

      }

      if (z % 10 === 0){
        console.log(`${z}/${worldDepth}`);
        console.timeEnd("layers");
        console.time("layers");
      }
    }

    console.timeEnd("allLayers");
    // console.log('processed');

    geometry.mergeVertices();
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();
    geometry.translate(- this.size / 2, 0, - this.size / 2);

    return geometry

    // let helper = new FaceNormalsHelper( mesh, 2, 0x00ff00, 1 );
    // scene.add(helper);

  }

  public generateStepTerrain(): Geometry {
    let geometry = new Geometry();
    // console.log(this.map);
    let matrix = new Matrix4();

    for (let h = this.mapEx.min; h < this.mapEx.max; h++) {

      console.log(h);

      let layer = new Shape();
      layer.moveTo( 0,  0);
      layer.lineTo(0, this.size);
      layer.lineTo(this.size, this.size);
      layer.lineTo(this.size, 0);
      layer.lineTo(0, 0);

      let holes = [];
      let path: Path = new Path();
      let matrixHoles: {[key: number]: MatrixCoordinate[]} = {};
      let matrix2d: MatrixCoordinate[] = [];
      let holePoints: MatrixCoordinate[] = [];

      for (let i = 0; i < this.size; i++) {
        for (let j = 0; j < this.size; j++) {
          let point = this.map[i * this.size + j];
          if (point > h) {
            let obj = {
              x: j,
              y: i,
              hole: true,
              index: i * this.size + j
            };

            holePoints.push(obj);
            matrix2d.push(obj);

          } else {
            let obj = {
              x: j,
              y: i,
              hole: false,
              index: i * this.size + j
            };

            matrix2d.push(obj);
          }
        }
      }

      let matrixRec = (currentPoint: MatrixCoordinate, i) => {
        let tempShape: MatrixCoordinate;
        let index: number;

        let check = (data: {shape: MatrixCoordinate, i: number, index: number, direction: VectorDirection}) => {
          if (!matrixHoles[i]) {
            matrixHoles[i] = [];
          }

          data.shape.shapeName =  `${i}`;
          matrixHoles[i].push(data.shape);
          matrixRec(data.shape, i);
        };


        //Справа
        index = currentPoint.y * this.size + currentPoint.x + 1;
        tempShape = matrix2d[index];
        // console.dir(`${JSON.stringify(currentPoint, null, 4)} - ${JSON.stringify(tempShape, null, 4)} - ${currentPoint.y * this.size + currentPoint.x + 1}`);
        if (
          tempShape &&
          tempShape.hole &&
          !tempShape.shapeName
        ) {
          check({shape: tempShape, i, index, direction: VectorDirection.Right});
        }

        //Снизу
        index = (currentPoint.y + 1) * this.size + currentPoint.x;
        tempShape = matrix2d[index];
        // console.dir(tempShape);
        // console.dir((currentPoint.y + 1) * this.size + currentPoint.x);
        // console.dir(`${JSON.stringify(currentPoint, null, 4)} - ${JSON.stringify(tempShape, null, 4)} - - ${currentPoint.y * (this.size + 1) + currentPoint.x}`);
        if (
          tempShape &&
          tempShape.hole &&
          !tempShape.shapeName
        ) {
          check({shape: tempShape, i, index, direction: VectorDirection.Down});
        }

        //Слева
        index = currentPoint.y * this.size + currentPoint.x - 1;
        tempShape  = matrix2d[index];
        // console.dir(`${JSON.stringify(currentPoint, null, 4)} - ${JSON.stringify(tempShape, null, 4)} - ${currentPoint.y * this.size + currentPoint.x - 1}`);
        if (
          tempShape &&
          tempShape.hole &&
          !tempShape.shapeName
        ) {
          check({shape: tempShape, i, index, direction: VectorDirection.Left});
        }

        //Сверху
        index = currentPoint.y * (this.size - 1) + currentPoint.x;
        tempShape = matrix2d[index];
        // console.dir(tempShape);
        // console.dir(currentPoint.y * (this.size - 1) + currentPoint.x);
        // console.dir(`${JSON.stringify(currentPoint, null, 4)} - ${JSON.stringify(tempShape, null, 4)} - ${currentPoint.y * (this.size - 1) + currentPoint.x}`);
        if (
          tempShape &&
          tempShape.hole &&
          !tempShape.shapeName
        ) {
          check({shape: tempShape, i, index, direction: VectorDirection.Up});
        }
      };

      let rotate = (direction, side) => {
        if (side === 'right') {
          if (direction === VectorDirection.Right) {
            return VectorDirection.Down
          } else if (direction === VectorDirection.Down) {
            return VectorDirection.Left
          } else if (direction === VectorDirection.Left) {
            return VectorDirection.Up
          } else if (direction === VectorDirection.Up) {
            return VectorDirection.Right
          }
          // direction === VectorDirection.Right
        } else if (side === 'left') {
          // direction
          if (direction === VectorDirection.Right) {
            return VectorDirection.Up
          } else if (direction === VectorDirection.Up) {
            return VectorDirection.Left
          } else if (direction === VectorDirection.Left) {
            return VectorDirection.Down
          } else if (direction === VectorDirection.Down) {
            return VectorDirection.Right
          }
        }
      };

      let vectorMove = (data: {direction: VectorDirection, index: number, initIndex: number}) => {
        console.log(`
          x: ${data.index % this.size} 
          y: ${Math.floor(data.index / this.size)} 
          index: ${data.index}
          initIndex: ${data.initIndex}
          direction: ${VectorDirection[data.direction]}
        `);

        //p1 - левая точка от вектора
        //p2 - правая точка от вектора
        //p3 - левая точка от вектора сзади
        //p4 - правая точка от вектора сзади
        if (!(data.index % this.size) && !Math.floor(data.index / this.size)){
          return;
        }

        let p1, p2, p3, p4;
        if (data.direction === VectorDirection.Right) {
          // console.log(matrix2d[data.index]);
          p1 = matrix2d[data.index - this.size];
          p2 = matrix2d[data.index];
          p3 = matrix2d[data.index - this.size - 1];
          p4 = matrix2d[data.index - 1];
        } else if (data.direction === VectorDirection.Down) {
          // console.log(matrix2d[data.index]);
          p1 = matrix2d[data.index];
          p2 = matrix2d[data.index - 1];
          p3 = matrix2d[data.index - this.size];
          p4 = matrix2d[data.index - this.size - 1];
        } else if (data.direction === VectorDirection.Left) {
          // console.log(matrix2d[data.index]);
          p3 = matrix2d[data.index];
          p4 = matrix2d[data.index - this.size];
          p1 = matrix2d[data.index - 1];
          p2 = matrix2d[data.index - this.size - 1];
        } else if (data.direction === VectorDirection.Up) {
          // console.log(matrix2d[data.index]);
          p1 = matrix2d[data.index - this.size - 1];
          p2 = matrix2d[data.index - this.size];
          p3 = matrix2d[data.index - 1];
          p4 = matrix2d[data.index];
        }

        if (
          data.index % this.size === 1
        ) {
          // Левая грань
          console.log(`Левая грань`);
          if (data.direction === VectorDirection.Right) {
            // p1 = {hole: false};
            // p3 = {hole: false};
          } else if (data.direction === VectorDirection.Down) {
            // p2 = {hole: false};
          } else if (data.direction === VectorDirection.Left) {
            // p2 = {hole: false};
          } else if (data.direction === VectorDirection.Up) {
          }
        }

        if (
          data.index % this.size === this.size - 1
        ) {
          if (data.direction === VectorDirection.Right) {
            p3 = {hole: false};
            p4 = {hole: false};
          } else if (data.direction === VectorDirection.Down) {
          } else if (data.direction === VectorDirection.Left) {
          } else if (data.direction === VectorDirection.Up) {
          }
          // Правая грань
          console.log(`Правая грань`);
        }

        if (data.index <= this.size) {
          // Верхняя грань
          console.log(`Верхняя грань`);
          if (data.direction === VectorDirection.Right) {
            p1 = {hole: false};
            p3 = {hole: false};
          } else if (data.direction === VectorDirection.Down) {
          } else if (data.direction === VectorDirection.Left) {
            p1 = {hole: false};
            p3 = {hole: false};
          } else if (data.direction === VectorDirection.Up) {
          }
        }

        if (data.index > this.size * (this.size - 1)) {
          // Нижняя грань
          console.log(`Нижняя грань`);
        }

        console.log([
          [p1, p2],
          [p3, p4]]
        );

        if (!p1) {
          p1 = {hole: false}
        }

        if (!p2) {
          p2 = {hole: false}
        }

        if (!p3) {
          p3 = {hole: false}
        }

        if (!p4) {
          p4 = {hole: false}
        }

        let moveIndex;
        let moveRotate;

        if (
          p1.hole && p2.hole && !p3.hole && p4.hole ||
          !p1.hole && !p2.hole && p3.hole && !p4.hole
        ) {
          console.log('поворот влево');
          moveRotate = rotate(data.direction, 'left');
        } else if (
          !p1.hole && p2.hole && !p3.hole && p4.hole ||
          p1.hole && !p2.hole && p3.hole && !p4.hole
        ) {
          console.log('продолжаем движение прямо');
          moveRotate = data.direction;
        } else if (
          !p1.hole && !p2.hole && !p3.hole && p4.hole ||
          p1.hole && p2.hole && p3.hole && !p4.hole
        ) {
          console.log('поворот вправо');
          moveRotate = rotate(data.direction, 'right');
        }

        if (moveRotate === VectorDirection.Right) {
          moveIndex = data.index + 1;
        } else if (moveRotate === VectorDirection.Down) {
          moveIndex = data.index + this.size;
        } else if (moveRotate === VectorDirection.Left) {
          moveIndex = data.index - 1;
        } else if (moveRotate === VectorDirection.Up) {
          moveIndex = data.index - this.size;
        }

        console.log({direction: moveRotate, index: moveIndex});

        if (data.index === data.initIndex){
          path.moveTo(data.index % this.size, Math.floor(data.index / this.size))
        }

        path.lineTo(data.index % this.size, Math.floor(data.index / this.size));

        if (moveIndex === data.initIndex) {
          let index = data.index + 1;
          path.lineTo(index % this.size, Math.floor(index / this.size));
          // console.log('вернулся в начальную точку');
          return;
        }

        vectorMove({direction: moveRotate, index: moveIndex, initIndex: data.initIndex});

      };

      for (let i = 0; i < holePoints.length - 1; i++) {
        let currentPoint = holePoints[i];
        if (!currentPoint.shapeName) {
          matrixRec(currentPoint, i);
        }
      }

      // console.log(holes);
      // console.log(matrixHoles);


      let holeVectors = [];

      for (const matrixHolesKey in matrixHoles) {
        let matrixHole = matrixHoles[matrixHolesKey];

        //0 потому что первая точка из семейства
        // path.moveTo(matrixHole[0].index % this.size, Math.floor(matrixHole[0].index / this.size));

        path = new Path();

        vectorMove({direction: VectorDirection.Right, index: matrixHole[0].index, initIndex: matrixHole[0].index});

        layer.holes = [...layer.holes, path];
        // for (let i = 0; i < matrixHole.length; i++) {
        //   let hole = matrixHole[i];
        // }
      }

      // console.log(holeVectors);
      // console.log(path);

      let extrudeSettings = {
        amount: 0,
        depth: 1,
        bevelEnabled: true,
        steps: 1,
        bevelThickness: 1,
        bevelSize: 0,
        bevelOffset: 0,
        bevelSegments: 1,
      };

      let extrudeGeometry = new ExtrudeGeometry( layer, extrudeSettings );
      extrudeGeometry.rotateX(Math.PI / 2);
      matrix.makeTranslation(-this.size / 2, h - this.mapEx.min + 1, this.size / 2 );
      geometry.merge(extrudeGeometry, matrix);
    }

    geometry.computeMorphNormals();
    geometry.computeFlatVertexNormals();
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();
    geometry.mergeVertices();

    return geometry;
  }

  public generatePlaneTerrain(): Geometry{
    let terraingGeometry = new PlaneGeometry(this.size, this.size, this.size - 1, this.size - 1);
    let min_height = Infinity;
    let max_height = -Infinity;
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        let height_val = this.get(x, y);
        if (height_val < min_height) {
          min_height = height_val;
        }
        if (height_val > max_height) {
          max_height = height_val;
        }
        if (height_val < 0) {
          height_val = 0;
        }
        if (y === 0 || y === this.size - 1 || x === 0 || x === this.size - 1) {
          height_val = 0.0;
        }
        terraingGeometry.vertices[y * this.size + x].z = height_val;
      }
    }

    terraingGeometry.rotateX(-Math.PI/2);
    terraingGeometry.computeFaceNormals();
    terraingGeometry.computeVertexNormals();

    return terraingGeometry;
  }


  /**
   * TODO: Will refactoring Water layer
   */


  getWater(): BoxGeometry {
    let water_geometry = new BoxGeometry(this.size, this.size, this.size);

    // get the vertices
    let l = water_geometry.vertices.length;

    this.waves = [];

    for (let i = 0; i < l; i++) {
      // get each vertex
      let v = water_geometry.vertices[i];

      // store some data associated to it
      this.waves.push({
        y: v.y,
        x: v.x,
        z: v.z,
        // a random angle
        ang: Math.random() * Math.PI * 2,
        // a random distance
        amp: 5 + Math.random() * 15,
        // a random speed between 0.016 and 0.048 radians / frame
        speed: 0.016 + Math.random() * 0.032
      });
    }

    return water_geometry;
  }

  getWaterWithMaterial(material: Material): Mesh {
    let min_height = Infinity;
    let max_height = -Infinity;

    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        let height_val = this.get(x, y);
        if (height_val < min_height) {
          min_height = height_val;
        }
        if (height_val > max_height) {
          max_height = height_val;
        }
        if (height_val < 0) {
          height_val = 0;
        }
        if (y === 0 || y === this.size - 1 || x === 0 || x === this.size - 1) {
          height_val = 0.0;
        }
      }
    }

    let water_mesh = new Mesh(this.getWater(), material);
    water_mesh.scale.z = (min_height + max_height) / (2 * this.size);
    // terrain_mesh.add(water_mesh);
    water_mesh.rotation.x = -Math.PI / 2.0;
    water_mesh.translateZ(((this.size / 2) * (min_height + max_height)) / (2 * this.size));

    return water_mesh;
  }

  moveWaves(water_mesh: Mesh) {
    // get the vertices
    let verts = (<Geometry>water_mesh.geometry).vertices;
    let l = verts.length;

    for (let i = 0; i < l; i++) {
      let v = verts[i];

      // get the data associated to it
      let vprops = this.waves[i];

      // update the position of the vertex
      v.x = vprops.x + Math.cos(vprops.ang) * vprops.amp;
      v.y = vprops.y + Math.sin(vprops.ang) * vprops.amp;

      // increment the angle for the next frame
      vprops.ang += vprops.speed;
    }

    // Tell the renderer that the geometry of the sea has changed.
    // In fact, in order to maintain the best level of performance,
    // three.js caches the geometries and ignores any changes
    // unless we add this line
    (<Geometry>water_mesh.geometry).verticesNeedUpdate = true;

    //TODO: check it
    (<any>water_mesh).mesh.rotation.z += 0.005;
  }
}
