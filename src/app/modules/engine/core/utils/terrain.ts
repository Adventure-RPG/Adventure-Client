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

export enum WallType {
  isSteps,
  isDungeon,
  isPolygon
}

export interface TerrainOptions {
  wallType: WallType;
  rotationX: number;
}

export class Terrain {
  size: number;
  max: number;
  map;
  waves;
  scaleZ = 1;

  constructor(size, scaleZ, map: number[][]) {
    this.size = size;
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

    // standard loop
    let max = this.map[0];
    for (let i = 1; i < this.map; ++i) {
      if (this.map[i] > max) {
        max = this.map[i];
      }
    }

    let min = -1;
    for (let i = 1; i < this.map; ++i) {
      if (this.map[i] < min) {
        min = this.map[i];
      }
    }


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
        let diff = h - min;
        let hres;
        diff >= 1 ? (hres = diff) : (hres = 1);

        // console.log(h);
        // console.log(diff);

        for (let y = min; y <= h; y++) {
          matrix.makeTranslation(
            x * cubeWidth,
            (y - min) * cubeWidth + 0.5 * cubeWidth,
            z * cubeWidth
          );
          geometry.merge(boxGeometry, matrix);
        }

      }

      if(z % 10 === 0){
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

    let heartShape = new Shape();

    heartShape.moveTo( -this.size/2, -this.size/2 );

    heartShape.lineTo(-this.size/2, this.size/2);
    heartShape.lineTo(this.size/2, this.size/2);
    heartShape.lineTo(this.size/2, -this.size/2);
    heartShape.lineTo(-this.size/2, -this.size/2);

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

    heartShape.holes = [new Path([
      new Vector2(0, 0),
      new Vector2(5, 0),
      new Vector2(5, 5),
      new Vector2(0, 5),
      new Vector2(0, 0),
    ])];

    let geometry = new ExtrudeGeometry( heartShape, extrudeSettings );
    geometry.rotateX(-Math.PI / 2);

    // geometry

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
