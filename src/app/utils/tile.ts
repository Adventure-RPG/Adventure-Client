import { CylinderGeometry, Mesh, MeshPhongMaterial, Object3D, WireframeGeometry, LineSegments, MeshBasicMaterial } from "@node_modules/three";

export class Tile extends Object3D {

  v; u; h;

  constructor(radius = 1, u, v, h = .25) {
    super();
    this.u = u;
    this.v = v;
    this.h = h;

    let geometry = new CylinderGeometry(radius * .8, radius * .8, radius * h, 6, 1, false, 0);
    let tileColor = this.randomColor();
    let material = new MeshPhongMaterial({
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
