import { Component, OnInit } from '@angular/core';
import {
  Blending, BlendingDstFactor, BlendingEquation, BlendingSrcFactor, Colors, DepthModes, Material, MaterialParameters,
  NoBlending,
  Side
} from "three";
import {FormBuilder, FormGroup} from "@angular/forms";
import 'reflect-metadata'

@Component({
  selector: 'adventure-material',
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.scss']
})
export class MaterialFormComponent implements OnInit {

  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({})
  }

  model = new MaterialFormAnnotation();

  form;

  submitted = false;

  onSubmit() { this.submitted = true; }

  // TODO: Remove this when we're done
  get diagnostic() { return JSON.stringify(this.model); }

  ngOnInit() {
    // console.log(this.model)
    // for (let obj in this.model) {
    //   console.log(obj);
    // }
    // console.log(new MaterialForm());
  }

}

export class MaterialFormAnnotation implements Material {


  @logType
  alphaTest: number;

  @logType
  blendDst: BlendingDstFactor;

  @logType
  blendDstAlpha: number;

  @logType
  blendEquation: BlendingEquation;

  @logType
  blendEquationAlpha: number;

  @logType
  blending: Blending;

  @logType
  blendSrc: BlendingSrcFactor | BlendingDstFactor;

  @logType
  blendSrcAlpha: number;

  @logType
  clipIntersection: boolean;

  @logType
  clippingPlanes: any;

  @logType
  clipShadows: boolean;

  @logType
  colorWrite: boolean;

  @logType
  depthFunc: DepthModes;

  @logType
  depthTest: boolean;

  @logType
  depthWrite: boolean;

  @logType
  fog: boolean;

  @logType
  id: number;

  @logType
  isMaterial: boolean;

  @logType
  lights: boolean;

  @logType
  name: string;

  @logType
  needsUpdate: boolean;

  @logType
  opacity: number;

  @logType
  overdraw: number;

  @logType
  polygonOffset: boolean;

  @logType
  polygonOffsetFactor: number;

  @logType
  polygonOffsetUnits: number;

  @logType
  precision;

  @logType
  premultipliedAlpha: boolean;

  @logType
  dithering: boolean;

  @logType
  flatShading: boolean;

  @logType
  side: Side;

  @logType
  transparent: boolean;

  @logType
  type: string;

  @logType
  uuid: string;

  @logType
  vertexColors: Colors;

  @logType
  visible: boolean;

  @logType
  userData: any;

  addEventListener(type: string, listener: (event: Event) => void): void {
  }

  hasEventListener(type: string, listener: (event: Event) => void): void {
  }

  removeEventListener(type: string, listener: (event: Event) => void): void {
  }

  dispatchEvent(event: { type: string; [p: string]: any }): void {
  }

  clone(): this {
    return null;
  }

  copy(material: this): this {
    return null;
  }

  dispose(): void {
  }

  setValues(values: MaterialParameters): void {
  }
  @logParamTypes
  toJSON(meta?: any): any {
    return null;
  }

  update(): void {
  }
}


function logType(target : any, key : string) {
  // console.log(target);
  var t = Reflect.getMetadata("design:type", target, key);
  console.log(`${key} type: ${t.name}`);
  console.log(t)
}

function logParamTypes(target : any, key : string) {
  var types = Reflect.getMetadata("design:paramtypes", target, key);
  var s = types.map(a => a.name).join();
  console.log(`${key} param types: ${s}`);
}

function logReturnType(target : any, key : string) {
  var types = Reflect.getMetadata("design:returntype", target, key);
  console.log(types);
}
