import { Mesh } from '@node_modules/three';
import { EngineService } from '@engine/engine.service';

export class SpellGeometry {
  position;
  matrixWorld;
  time;
  target;

  constructor(private mesh, private engineService) {
    this.engineService.sceneService.scene.add(mesh);
    this.matrixWorld = mesh.matrixWorld;
    this.time = 0;
  }

  public rotateX(angle) {
    this.mesh.rotateX(angle);
  }

  public lookAt() {
    this.mesh.lookAt(this.target);
  }

  public destroy() {
    this.engineService.sceneService.scene.remove(this.mesh);
  }

  public update() {
    this.mesh.position.set(this.position.x + 25 * Math.cos(this.time), this.position.y, this.position.z);
    this.lookAt();
  }

  public setTarget(target) {
    this.target = target;
  }

  public setPosition(position, delta) {
    this.position = position;
    this.time += delta;
    this.update();
    console.log(this.position);
    console.log(this.mesh.position);
  }
}
