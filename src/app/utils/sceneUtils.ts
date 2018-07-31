/**
 * @author alteredq / http://alteredqualia.com/
 */

import { Group, Matrix4, Mesh } from 'three';

export class SceneUtils {
  static createMultiMaterialObject(geometry, materials) {
    const group = new Group();

    for (let i = 0, l = materials.length; i < l; i++) {
      group.add(new Mesh(geometry, materials[i]));
    }

    return group;
  }

  static detach(child, parent, scene) {
    child.applyMatrix(parent.matrixWorld);
    parent.remove(child);
    scene.add(child);
  }

  static attach(child, scene, parent) {
    child.applyMatrix(new Matrix4().getInverse(parent.matrixWorld));

    scene.remove(child);
    parent.add(child);
  }
}
