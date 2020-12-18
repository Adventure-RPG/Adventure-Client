import { CylinderGeometry, Mesh, MeshPhongMaterial, Object3D, WireframeGeometry, LineSegments, MeshBasicMaterial } from "@node_modules/three";

export class Tile extends Object3D {

  h;

  constructor(radius = 1, h = 0, cell) {
    super();
    this.h = h;

    if (h < 0.25) {
      h = 0.25;
    }

    let geometry = new CylinderGeometry(radius, radius, radius * h, 6, 1, false, 0);
    let tileColor = this.biomeColor(cell.properties.biome);
    let material = new MeshPhongMaterial({
      color: tileColor
    });

    material.flatShading = true;
    let mesh = new Mesh(geometry, material);
    this.add(mesh);

    return this;
  };

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

  randomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
};
