import { Mesh } from '@node_modules/three';
import { EngineService } from '@engine/engine.service';

export class SpellGeometry {
  position;
  matrixWorld;
  time;
  constructor(public mesh, private engineService) {
    this.engineService.sceneService.scene.add(mesh);
    this.matrixWorld = mesh.matrixWorld;
    this.time = 0;
  }
  public rotateX(angle) {
    this.mesh.rotateX(angle);
  }
  public lookAt(target) {
    this.mesh.lookAt(target);
  }
  public destroy() {
    this.engineService.sceneService.scene.remove(this.mesh);
  }
  public update() {
    this.mesh.position.set(this.position.x, this.position.y, this.position.z);
  }
  public setPosition(position, delta) {
    this.position = position;
    this.time += delta;
    this.update();
    console.log(this.position);
    console.log(this.mesh.position);
  }
}
