import { Box3, Object3D, Vector2, Vector3 } from "@node_modules/three";
import { Tile } from "./tile";
import { Utils } from "./utils";

export class Board extends Object3D {
  grid; u; v; z;

  constructor(countU, countV) {
    super();

    let radius = 10;
    this.grid = new Array();

    //TODO: подумать о том что бы свести двумерный массив к одномерному.
    for(let u = (-countU / 2); u < (countU / 2); u++) {
      this.grid[u] = this.grid[u] || new Array();
      for(let v = (-countV / 2); v < (countV / 2); v++) {
        let h = 0;
        let hex = new Tile(radius, u, v, Utils.randomInt(0, 3));
        let box = new Box3().setFromObject(hex);
        let hexW = box.max.x - box.min.x;
        let hexH = box.max.z - box.min.z;
        let hexX = u * hexW;
        let hexZ = v * hexH * .75;
        if(Math.abs(v % 2) == 1) hexX = hexX + (hexW / 2);
        hex.position.set(hexX, 0, hexZ);
        this.grid[u][v] = this.grid[u][v] || new Array();
        this.grid[u][v] = hex;
        this.add(hex);
      };
    };

    console.log(this.grid);
  };

  fromCube(cube) {
    let u = cube.x + (cube.z + Math.abs(cube.z % 2)) / 2;
    let v = cube.z;
    return new Vector2(u, v);
  };

  toCube() {
    let x = this.u - (this.v + Math.abs(this.v % 2)) / 2;
    let z = this.v;
    let y = -x-z;
    return new Vector3(x, y, z);
  };
};
