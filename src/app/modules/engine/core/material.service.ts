import {Injectable} from '@angular/core';
import {
  LineBasicMaterial, LineDashedMaterial, Material, MeshBasicMaterial, MeshDepthMaterial, MeshLambertMaterial,
  MeshNormalMaterial, MeshPhongMaterial, MeshPhysicalMaterial, MeshStandardMaterial, PointsMaterial, RawShaderMaterial,
  ShaderMaterial, ShadowMaterial, SpriteMaterial
} from 'three';

@Injectable()
export class MaterialService {
  constructor() {}

  // TODO: add MeshToonMaterial when material added to @types

  addMaterial(
    material:
      | LineBasicMaterial
      | LineDashedMaterial
      | Material
      | MeshBasicMaterial
      | MeshDepthMaterial
      | MeshLambertMaterial
      | MeshNormalMaterial
      | MeshPhongMaterial
      | MeshPhysicalMaterial
      | MeshStandardMaterial
      | PointsMaterial
      | RawShaderMaterial
      | ShaderMaterial
      | ShadowMaterial
      | SpriteMaterial
  ) {
    new LineBasicMaterial(material);
  }
}
