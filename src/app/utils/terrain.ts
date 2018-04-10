import {BoxGeometry, Material, Mesh, MeshBasicMaterial, MeshNormalMaterial, PlaneGeometry} from 'three';

export class Terrain {

  size: number;
  max: number;
  map;
  scaleZ = 1;

  constructor(size, scaleZ, map: number[][]){
    this.size = size;
    this.max = this.size - 1;
    this.scaleZ = scaleZ;
    // this.map = map;

    if (map){
      this.map = [];
      map.forEach((value: number[], index: number) => {
        this.map.push(value[2] * this.scaleZ);
      });
    } else {
      this.map = new Float32Array(this.size * this.size);
    }

  }

  get(x, y) {
    if (x < 0 || x > this.max || y < 0 || y > this.max) return -1;
    return this.map[x + this.size * y];
  };

  set(x, y, val) {
    this.map[x + this.size * y] = val;
  };

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
      let x, y, half = size / 2;
      let scale = roughness * size;
      if (half < 1) return;

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
    }

    let average = (values) => {
      let valid = values.filter(function (val) {
        return val !== -1;
      });
      let total = valid.reduce(function (sum, val) {
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
    }

    this.set(0, 0, this.max);
    this.set(this.max, 0, this.max / 2);
    this.set(this.max, this.max, 0);
    this.set(0, this.max, this.max / 2);

    divide(this.max);
  };

  getTerrain(): PlaneGeometry{
    let terrain_geometry = new PlaneGeometry(this.size, this.size, this.size - 1, this.size - 1);
    let min_height = Infinity;
    let max_height = -Infinity;
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        let height_val = this.get(x, y);
        if ( height_val < min_height ) min_height = height_val;
        if ( height_val > max_height ) max_height = height_val;
        if ( height_val < 0 ) height_val = 0;
        if (y === 0 || y === this.size - 1 || x === 0 || x === this.size - 1) height_val = 0.0;
        terrain_geometry.vertices[y * this.size + x].z = height_val;
      }
    }

    terrain_geometry.computeFaceNormals();
    terrain_geometry.computeVertexNormals();

    return terrain_geometry;
  }

  getTerrainWithMaterial(material: Material | Material[]){
    let terrain_mesh = new Mesh(this.getTerrain(), material);
    terrain_mesh.rotation.x = -Math.PI / 2.0;
    return terrain_mesh;
  }

  getWater(): BoxGeometry {
    let water_geometry = new BoxGeometry(this.size, this.size, this.size);
    return water_geometry;
  }

  getWaterWithMaterial(material: Material | Material[]) {
    let min_height = Infinity;
    let max_height = -Infinity;

    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        let height_val = this.get(x, y);
        if ( height_val < min_height ) min_height = height_val;
        if ( height_val > max_height ) max_height = height_val;
        if ( height_val < 0 ) height_val = 0;
        if (y === 0 || y === this.size - 1 || x === 0 || x === this.size - 1) height_val = 0.0;
      }
    }

    let water_mesh = new Mesh(this.getWater(), material);
    water_mesh.scale.z = (min_height + max_height) / (2 * this.size);
    water_mesh.translateZ((this.size / 2) * (min_height + max_height) / (2 * this.size));
    // terrain_mesh.add(water_mesh);
    water_mesh.rotation.x = -Math.PI / 2.0;

    return water_mesh;
  }



}
