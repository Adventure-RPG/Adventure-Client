import { BoxGeometry, Group, Mesh, MeshPhongMaterial, PlaneGeometry } from "three";

export class ObjectCreater {
  static createBorder({borderWidth, size, borderHeight}){
    let group = new Group();
    let mesh = new Mesh(
      new BoxGeometry(borderWidth, size, borderHeight),
      new MeshPhongMaterial({ color: 0xf58426, depthWrite: true, opacity: 1 })
    );

    mesh.rotation.x = -Math.PI / 2;
    mesh.translateX(-size / 2 - borderWidth / 2);
    mesh.translateY(0);
    mesh.translateZ(borderHeight / 2);
    mesh.receiveShadow = true;
    group.add(mesh);

    mesh = new Mesh(
      new BoxGeometry(borderWidth, size, borderHeight),
      new MeshPhongMaterial({ color: 0xf58426, depthWrite: true, opacity: 1 })
    );
    mesh.rotation.x = -Math.PI / 2;
    mesh.translateX(size / 2 + borderWidth / 2);
    mesh.translateY(0);
    mesh.translateZ(borderHeight / 2);
    mesh.receiveShadow = true;
    group.add(mesh);

    mesh = new Mesh(
      new BoxGeometry(borderWidth, size, borderHeight),
      new MeshPhongMaterial({ color: 0xf58426, depthWrite: true, opacity: 1 })
    );
    mesh.rotation.x = -Math.PI / 2;
    mesh.rotation.z = -Math.PI / 2;
    mesh.translateX(size / 2 + borderWidth / 2);
    mesh.translateY(0);
    mesh.translateZ(borderHeight / 2);
    mesh.receiveShadow = true;
    group.add(mesh);

    mesh = new Mesh(
      new BoxGeometry(borderWidth, size, borderHeight),
      new MeshPhongMaterial({ color: 0xf58426, depthWrite: true, opacity: 1 })
    );
    mesh.rotation.x = -Math.PI / 2;
    mesh.rotation.z = -Math.PI / 2;
    mesh.translateX(- size / 2 - borderWidth / 2);
    mesh.translateY(0);
    mesh.translateZ(borderHeight / 2);
    mesh.receiveShadow = true;
    group.add(mesh);

    mesh = new Mesh(
      new BoxGeometry(borderWidth, borderWidth, 2 * borderHeight),
      new MeshPhongMaterial({ color: 0xf33426, depthWrite: true, opacity: 1 })
    );
    mesh.rotation.x = -Math.PI / 2;
    mesh.translateX(- size / 2 - borderWidth / 2);
    mesh.translateY(- size / 2 - borderWidth / 2);
    mesh.translateZ(borderHeight);
    mesh.receiveShadow = true;
    group.add(mesh);

    mesh = new Mesh(
      new BoxGeometry(borderWidth, borderWidth, 2 * borderHeight),
      new MeshPhongMaterial({ color: 0xf33426, depthWrite: true, opacity: 1 })
    );
    mesh.rotation.x = -Math.PI / 2;
    mesh.translateX(- size / 2 - borderWidth / 2);
    mesh.translateY(size / 2 + borderWidth / 2);
    mesh.translateZ(borderHeight);
    mesh.receiveShadow = true;
    group.add(mesh);

    mesh = new Mesh(
      new BoxGeometry(borderWidth, borderWidth, 2 * borderHeight),
      new MeshPhongMaterial({ color: 0xf33426, depthWrite: true, opacity: 1 })
    );
    mesh.rotation.x = -Math.PI / 2;
    mesh.translateX( size / 2 + borderWidth / 2);
    mesh.translateY(- size / 2 - borderWidth / 2);
    mesh.translateZ(borderHeight);
    mesh.receiveShadow = true;
    group.add(mesh);

    mesh = new Mesh(
      new BoxGeometry(borderWidth, borderWidth, 2 * borderHeight),
      new MeshPhongMaterial({ color: 0xf33426, depthWrite: true, opacity: 1 })
    );
    mesh.rotation.x = -Math.PI / 2;
    mesh.translateX(size / 2 + borderWidth / 2);
    mesh.translateY(size / 2 + borderWidth / 2);
    mesh.translateZ(borderHeight);
    mesh.receiveShadow = true;
    group.add(mesh);

    return group;
  };
  static createGrid({divisions, size}){
    let group = new Group();
    let cell = size / divisions;

    // ground
    for (let i = 0; i < divisions; i++) {
      for (let j = 0; j < divisions; j++) {
        let color;

        if ((i + divisions + j) % 2){
          color = 0x000
        } else {
          color = 0x333
        }

        // ground
        let mesh = new Mesh(
          new PlaneGeometry(cell, cell),
          new MeshPhongMaterial({
            color,
            depthWrite: true,
            opacity: 1
          })
        );

        mesh.rotation.x = -Math.PI / 2;
        mesh.translateX( (cell * i - size / 2 + cell / 2));
        mesh.translateY(-(cell * j - size / 2 + cell / 2));
        mesh.translateZ(0);
        mesh.name = `cell i:${i} j:${j}`;

        group.add(mesh);

        // mesh.translateX(size/divisions);
      }
    }
    console.log(group);

    return group;

  }
}
