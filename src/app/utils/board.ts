import { Box3, BufferGeometry, Line, LineBasicMaterial, Object3D, Vector2, Vector3 } from "@node_modules/three";
import { Tile } from "./tile";
import { Utils } from "./utils";
import { Feature } from "../../typings";

export class Board extends Object3D {
  board = {}; grid; u; v; z;

  constructor(grid: Feature[], radius) {
    super();

    this.grid = grid;


    for (let i = 0; i < this.grid.length; i++) {
      let cell = this.grid[i];
      const points = [];

      //feature.properties.height
      let cellCoordinate = cell.geometry.coordinates[0][0];

      // console.log();

      // let h = 0;
      let hex = new Tile(radius * 5000, cell.properties.height/1000, cell);
      let box = new Box3().setFromObject(hex);
      let hexW = box.max.x - box.min.x;
      let hexH = box.max.z - box.min.z;
      let hexX = (cellCoordinate[0] + 68.2) * 5000;
      let hexZ = (cellCoordinate[1] - 30.5) * 5000;
      hex.position.set(hexX, 0, hexZ);
      // this.board[cell.properties.id] = hex;
      this.add(hex);

    }


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
