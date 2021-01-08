import {
  Box3, BufferGeometry, Color, CylinderGeometry, Geometry, InstancedBufferAttribute, InstancedBufferGeometry,
  InstancedMesh, Line, LineBasicMaterial, Mesh, MeshNormalMaterial,
  MeshPhongMaterial, Object3D, Vector2,
  Vector3
} from "@node_modules/three";
import { Utils } from "./utils";
import { Feature } from "../../typings";

export class Board extends Object3D {
  board = {}; grid; u; v; z;
  instancedMeshes = {
    tiles: null,
    tree: null
  };

  proxy: {[key: string]: Object3D} = {
    tiles: new Object3D(),
    tree: new Object3D(),
  };

  createHexagons({radius, count}){
    const geometry = new CylinderGeometry(radius, radius, radius, 6, 1, false, 0);
    const material = new MeshPhongMaterial({
      color: '#fff',
      flatShading: true,
    });
    this.instancedMeshes.tiles = new InstancedMesh(geometry, material, count);
    this.add(this.instancedMeshes.tiles);
  }

  createTreeInstance({radius, count, models}) {
    const material = new MeshPhongMaterial({
      color: '#ffffff',
      flatShading: true,
    });

    console.log(models);
    console.log(models[0].children[0]);

    let model = models[Utils.randomInt(0, models.length)];


    let modelGeometry = new Geometry();

    for (let i = 0; i < model.children.length; i++) {
      let child = model.children[i];
      modelGeometry.merge(new Geometry().fromBufferGeometry(child.geometry).center());
    }

    let bufferGeometry = new BufferGeometry().fromGeometry(modelGeometry);

    bufferGeometry.scale(.1, .1, .1);

    console.log(bufferGeometry);
    this.instancedMeshes.tree = new InstancedMesh(bufferGeometry, material, count);
    this.add(this.instancedMeshes.tree);
  }

  makeInstance ( geometry, material ) {

    const instanceCount = material.userData.instanceCount;

    const instanceID = new InstancedBufferAttribute(
      new Float32Array( new Array( instanceCount ).fill( 0 ).map( ( _, index ) => index ) ),
      1
    );

    geometry = new InstancedBufferGeometry().copy( geometry );
    geometry.addAttribute( 'instanceID', instanceID );
    geometry.maxInstancedCount = instanceCount;

    return geometry;

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

  constructor(grid: Feature[], radius: number, models: Object3D[]) {
    super();

    this.grid = grid;
    const k = 10;
    this.createHexagons({radius, count: this.grid.length});
    let treeCount = this.grid.filter(cell => {
      return cell.properties.biome === 8
    });
    this.createTreeInstance({radius, count: treeCount.length * 5, models});
    // console.log(treeCount.length);

    for (let i = 0; i < this.grid.length; i++) {
      let cell = this.grid[i];
      let cellCoordinate = cell.geometry.coordinates;

      let hexX = (cellCoordinate[0] + 68.3) * k;
      let hexZ = (cellCoordinate[1] + 33.6) * k;
      if (cell.properties.biome !== 0) {
        //any biome
        let height = Math.round(cell.properties.height / 500) + 0.1;
        this.proxy.tiles.position.set(hexX, radius / 2, hexZ);
        this.proxy.tiles.scale.set(1, height,1);
        // this.proxyMatrix
        if (cell.properties.biome === 8) {
          this.proxy.tree.position.set(hexX,  radius/ 2 * height + radius, hexZ);
          this.proxy.tree.rotation.set(0, Math.PI * Math.random(), 0);
          this.proxy.tree.updateMatrix();
          this.instancedMeshes.tree.setMatrixAt(i, this.proxy.tree.matrix);
        }
      } else {
        //WATER
        this.proxy.tiles.position.set(hexX,0, hexZ);
        this.proxy.tiles.scale.set(1,1,1);
      }
      this.instancedMeshes.tiles.setColorAt(i, new Color(this.biomeColor(cell.properties.biome)));
      this.instancedMeshes.tiles.instanceColor.needsUpdate = true;
      // this.instancedMeshes2.setColorAt(i, new Color(this.biomeColor(cell.properties.biome)));
      // this.instancedMeshes2.instanceColor.needsUpdate = true;
      this.proxy.tiles.updateMatrix();
      this.instancedMeshes.tiles.setMatrixAt(i, this.proxy.tiles.matrix);
    }

    this.instancedMeshes.tiles.instanceMatrix.needsUpdate = true;
    this.instancedMeshes.tree.instanceMatrix.needsUpdate = true;
    // this.board[cell.properties.id] = hex;
    // this.add(tile);
    // }
  };

  generateTree({radius}){
    const mergeMeshes = new Geometry();

    let startY = 0;

    const treeMaterial = new MeshPhongMaterial({
      color: '#11f660',
      flatShading: true,
    });

    const tree = new Mesh(new CylinderGeometry(0, radius, radius, 5, 1, false, 0), treeMaterial);
    tree.position.setY(startY + 3 * radius * 0.8);
    tree.rotateY(Math.PI/12);

    mergeMeshes.mergeMesh(
      tree
    );

    const tree2 = new Mesh(new CylinderGeometry(0, 0.9*radius, radius, 5, 1, false, 0), treeMaterial);
    tree2.position.setY(startY + 2 * radius * 0.8);
    tree2.rotateY(Math.PI/6);

    mergeMeshes.mergeMesh(
      tree2
    );

    const tree3 = new Mesh(new CylinderGeometry(0, 1.0*radius, radius, 5, 1, false, 0), treeMaterial);
    tree3.position.setY(startY + radius * 0.75);
    tree3.rotateY(Math.PI/8);

    mergeMeshes.mergeMesh(
      tree3
    );

    const tree4 = new Mesh(new CylinderGeometry(0, 0.8*radius, radius, 5, 1, false, 0), treeMaterial);
    tree4.position.setY(startY);

    mergeMeshes.mergeMesh(
      tree4
    );
    mergeMeshes.mergeVertices();
    mergeMeshes.scale(0.2, 0.2, 0.2)
    return mergeMeshes;
  }



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
