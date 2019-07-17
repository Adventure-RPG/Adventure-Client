import { GeometryObject } from '@engine/core/utils/geometryObject';

export interface Effects {
  object?: GeometryObject[];
  name?: String;
  update?(delta);
}
