// declare module 'Inflate';

export interface TreeElement {
  title: string;
  key: string;
  element: Element;
  children: any[];
  expanded: boolean;
  selected: boolean;
  checked: boolean;
}

export interface GeoJSON {
  features: Feature[];
}

export interface Feature {
  geometry: Geometry;
  properties: Properties;
  type: string;
}

export interface Geometry {
  coordinates: number[];
  type: string;
}

export interface Properties {
  biome: number;
  culture: number;
  height: number;
  id: number;
  population: number;
  province: number;
  religion: number;
  state: number;
  type: string;
}
