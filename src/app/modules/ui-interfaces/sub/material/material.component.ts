import { Component, OnInit } from '@angular/core';
import {
  Blending, BlendingDstFactor, BlendingEquation, BlendingSrcFactor, Colors, DepthModes, Material, MaterialParameters,
  NoBlending,
  Side
} from "three";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import 'reflect-metadata'
import {IsBoolean, IsNumber, IsString, IsUUID, Max, Min, Validator} from "class-validator";

// Validation methods
const ClassValidator = new Validator();


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

  @IsNumber()
  @Min(0)
  @Max(1)
  alphaTest: number;

  blendDst: BlendingDstFactor;

  @IsNumber()
  @Min(0)
  @Max(1)
  blendDstAlpha: number;

  blendEquation: BlendingEquation;

  @IsNumber()
  @Min(0)
  @Max(1)
  blendEquationAlpha: number;

  blending: Blending;

  blendSrc: BlendingSrcFactor | BlendingDstFactor;

  @IsNumber()
  @Min(0)
  @Max(1)
  blendSrcAlpha: number;

  @IsBoolean()
  clipIntersection: boolean;

  clippingPlanes: any;

  @IsBoolean()
  clipShadows: boolean;

  @IsBoolean()
  colorWrite: boolean;

  depthFunc: DepthModes;

  @IsBoolean()
  depthTest: boolean;

  @IsBoolean()
  depthWrite: boolean;

  @IsBoolean()
  fog: boolean;

  @IsNumber()
  id: number;

  @IsBoolean()
  isMaterial: boolean;
  @IsBoolean()
  lights: boolean;
  name: string;
  @IsBoolean()
  needsUpdate: boolean;

  @IsNumber()
  @Min(0)
  @Max(1)
  opacity: number;

  overdraw: number;

  @IsBoolean()
  polygonOffset: boolean;

  polygonOffsetFactor: number;

  polygonOffsetUnits: number;

  precision;

  @IsBoolean()
  premultipliedAlpha: boolean;

  @IsBoolean()
  dithering: boolean;

  @IsBoolean()
  flatShading: boolean;

  side: Side;

  @IsBoolean()
  transparent: boolean;

  @IsString()
  type: string;

  @IsUUID()
  uuid: string;

  vertexColors: Colors;

  @IsBoolean()
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
