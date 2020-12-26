import {
  Box3, BufferGeometry, Color, CylinderGeometry, InstancedMesh, Line, LineBasicMaterial, MeshNormalMaterial,
  MeshPhongMaterial, Object3D, Vector2,
  Vector3
} from "@node_modules/three";
import { Utils } from "./utils";
import { Feature } from "../../typings";

export class Board extends Object3D {
  board = {}; grid; u; v; z;
  tiles;

  proxyMatrix = new Object3D();

  createHexagons({radius, count}){
    const geometry = new CylinderGeometry(radius, radius, radius, 6, 1, false, 0);
    const material = new MeshPhongMaterial({
      color: '#fff',
      flatShading: true,
    });
    this.tiles = new InstancedMesh(geometry, material, count);
    this.add(this.tiles);
  }

  biomeColor(biome) {
    switch (biome) {
      case 0:
        return '#1233dd'
      case 1:
        return '#fbe79f'
      case 2:
        return '#b5b887'
      case 3:
        return '#d2d082'
      case 4:
        return '#c8d68f'
      case 5:
        return '#b6d95d'
      case 6:
        return '#29bc56'
      case 7:
        return '#7dcb35'
      case 8:
        return '#409c43'
      case 9:
        return '#4b6b32'
      case 10:
        return '#96784b'
      case 11:
        return '#d5e7eb'
      case 12:
        return '#0b9131'
      default:
        console.log(biome)
        return '#000'
    }
  }

  constructor(grid: Feature[], radius) {
    super();

    this.grid = grid;
    const k = 10;

    this.createHexagons({radius, count: this.grid.length});

    let box = new Box3().setFromObject(this.tiles);
    let hexW = box.max.x - box.min.x;
    let hexY = box.max.y - box.min.y;

    console.log(hexY);

    for (let i = 0; i < this.grid.length; i++) {
      let cell = this.grid[i];
      let cellCoordinate = cell.geometry.coordinates;

      let hexX = (cellCoordinate[0] + 68.2) * k;
      let hexZ = (cellCoordinate[1] + 33.5) * k;
      if (cell.properties.biome !== 0) {
        //any biome
        let height = Math.round(cell.properties.height / 500) + 0.1;
        this.proxyMatrix.position.set(hexX, hexY / 2, hexZ);
        this.proxyMatrix.scale.set(1,height,1);
        // this.proxyMatrix
      } else {
        //WATER
        this.proxyMatrix.position.set(hexX,0, hexZ);
        this.proxyMatrix.scale.set(1,1,1);
      }
      this.tiles.setColorAt(i, new Color(this.biomeColor(cell.properties.biome)));
      this.tiles.instanceColor.needsUpdate = true;
      this.proxyMatrix.updateMatrix();
      this.tiles.setMatrixAt(i, this.proxyMatrix.matrix);
    }

    this.tiles.instanceMatrix.needsUpdate = true;
      // this.board[cell.properties.id] = hex;
      // this.add(tile);

    // }


    // console.log(this.board);
    // console.log(this.grid);
  };

  // fromCube(cube) {
  //   let u = cube.x + (cube.z + Math.abs(cube.z % 2)) / 2;
  //   let v = cube.z;
  //   return new Vector2(u, v);
  // };
  //
  // toCube() {
  //   let x = this.u - (this.v + Math.abs(this.v % 2)) / 2;
  //   let z = this.v;
  //   let y = -x-z;
  //   return new Vector3(x, y, z);
  // };
};
