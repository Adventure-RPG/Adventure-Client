import { CylinderGeometry, Mesh, MeshPhongMaterial, Object3D, WireframeGeometry, LineSegments, MeshBasicMaterial, Group, ConeGeometry, InstancedMesh } from "@node_modules/three";

export class Tile extends Object3D {

  h;
  hexagon;

  constructor(radius = 1, h = 0, cell) {
    super();
    this.h = h;

    this.createHexagon({cell, radius, h});
    // this.createTree({cell, radius, h});

    return this;
  };

  createHexagon({cell, radius, h}){
    if (cell.properties.biome !== 0 && h < 0.25) {
      h = 0.25;
    } else if (cell.properties.biome === 0) {
      h = 0.1;
    }

    let geometry = new CylinderGeometry(radius, radius, radius * h, 6, 1, false, 0);
    let tileColor = this.biomeColor(cell.properties.biome);
    let material = new MeshPhongMaterial({
      color: tileColor
    });

    material.flatShading = true;
    let mesh = new Mesh(geometry, material);
    this.add(mesh);
    this.hexagon = mesh;
  }

  createTree({cell, radius, h}) {
    if (cell.properties.biome === 7 && h < 0.25) {
      let tree = new Group();
      let attempt = 0;
      let material = new MeshPhongMaterial({
        color: '#a2bcd9'
      });
      let prevHeight = 0;

      for (let i = 0; i <= 0; i++) {
        let height = (Math.random() * 3 + 5 ) / 100;
        let geometry = new ConeGeometry(radius, radius, 3, 1, true);
        for (let j = 0; j < geometry.vertices.length; j++) {
          let vector = geometry.vertices[j];
          vector.x += Math.random();
          vector.z += Math.random();
        }
        //TODO: поменять на InstancedMesh после обновления threejs
        let cylinder = new Mesh(geometry, material);
        // cylinder.position.y = -prevHeight - height / 2;
        cylinder.rotation.y = Math.random() * Math.PI * 2;
        prevHeight += height;
        tree.add(cylinder);
      }
      let geometry = new CylinderGeometry(radius / 5, radius / 3, radius/2, 3);
      // geometry.computeFlatVertexNormals();
      material = new MeshPhongMaterial({color: '#645237'});
      let log = new Mesh(geometry, material);
      tree.add(log);

      this.add(tree);
    }
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

  randomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
};
