import { Component, OnInit } from '@angular/core';
import {
  Blending, BlendingDstFactor, BlendingEquation, BlendingSrcFactor, Colors, DepthModes, Material, MaterialParameters,
  NoBlending,
  Side
} from "three";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import 'reflect-metadata'

// Validation methods


@Component({
  selector: 'adventure-material',
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.scss']
})
export class MaterialFormComponent implements OnInit {

  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      alphaTest: [null, [Validators.required, Validators.min(0), Validators.max(1)]]
    })
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

  alphaTest: number;

  blendDst: BlendingDstFactor;

  blendDstAlpha: number;

  blendEquation: BlendingEquation;

  blendEquationAlpha: number;

  blending: Blending;

  blendSrc: BlendingSrcFactor | BlendingDstFactor;

  blendSrcAlpha: number;

  clipIntersection: boolean;

  clippingPlanes: any;

  clipShadows: boolean;

  colorWrite: boolean;

  depthFunc: DepthModes;

  depthTest: boolean;

  depthWrite: boolean;

  fog: boolean;

  id: number;

  isMaterial: boolean;
  lights: boolean;
  name: string;
  needsUpdate: boolean;

  opacity: number;

  overdraw: number;

  polygonOffset: boolean;

  polygonOffsetFactor: number;

  polygonOffsetUnits: number;

  precision;

  premultipliedAlpha: boolean;

  dithering: boolean;

  flatShading: boolean;

  side: Side;

  transparent: boolean;

  type: string;

  uuid: string;

  vertexColors: Colors;

  visible: boolean;

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

  toJSON(meta?: any): any {
    return null;
  }

  update(): void {
  }
}
