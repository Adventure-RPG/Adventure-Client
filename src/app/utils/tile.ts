import { CylinderGeometry, Mesh, MeshLambertMaterial, Object3D } from "@node_modules/three";

export class Tile extends Object3D {
  constructor(radius = 1, anim = false) {
    super();

    let height = .25;
    let geometry = new CylinderGeometry(radius * .8, radius * .8, height, 6);
    let tileColor = this.randomColor();
    let material = new MeshLambertMaterial({
      color: tileColor
    });
    material.flatShading = true;
    let mesh = new Mesh(geometry, material);
    this.add(mesh);

    return this;
  };

  randomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
};
