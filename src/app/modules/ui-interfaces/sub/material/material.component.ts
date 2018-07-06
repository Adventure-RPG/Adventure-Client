import {Component, OnInit} from '@angular/core';
import {
  AddEquation,
  AdditiveBlending, AlwaysDepth,
  BackSide,
  Blending,
  BlendingDstFactor,
  BlendingEquation,
  BlendingSrcFactor,
  Colors, CustomBlending,
  DepthModes, DoubleSide, DstAlphaFactor, DstColorFactor, EqualDepth, FaceColors, FlatShading, FrontSide, GreaterDepth,
  GreaterEqualDepth, LessDepth,
  LessEqualDepth,
  Material,
  MaterialParameters, MaxEquation, MinEquation, MultiplyBlending, NeverDepth,
  NoBlending, NoColors, NormalBlending, NotEqualDepth, OneFactor, OneMinusDstAlphaFactor, OneMinusDstColorFactor,
  OneMinusSrcAlphaFactor,
  OneMinusSrcColorFactor,
  ReverseSubtractEquation,
  Side, SmoothShading, SrcAlphaFactor, SrcAlphaSaturateFactor, SrcColorFactor, SubtractEquation, SubtractiveBlending,
  VertexColors, ZeroFactor
} from 'three';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import 'reflect-metadata';
import {Shading} from "three/three-core";

// Validation methods



@Component({
  selector: 'adventure-material',
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.scss']
})
export class MaterialFormComponent implements OnInit {
  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      alphaTest: [null, [Validators.required, Validators.min(0), Validators.max(1)]],
      blendDst: [null],
      blendDstAlpha: [null, [Validators.required, Validators.min(0), Validators.max(1)]],
      blendEquation: [null],
      blendEquationAlpha: [null, [Validators.required, Validators.min(0), Validators.max(1)]],
      blending: [null],
      blendSrc: [null],
      blendSrcAlpha: [null, [Validators.required, Validators.min(0), Validators.max(1)]],
      clipIntersection: [null],
      clippingPlanes: [null],
      clipShadows: [null],
      colorWrite: [null],
      depthFunc: [null],
      depthTest: [null],
      depthWrite: [null],
      fog: [null],
      id: [null],
      isMaterial: [null],
      lights: [null],
      name: [null],
      needsUpdate: [null],
      opacity: [null],
      overdraw: [null],
      polygonOffset: [null],
      polygonOffsetFactor: [null],
      polygonOffsetUnits: [null],
      precision: [null],
      premultipliedAlpha: [null, [Validators.required, Validators.min(0), Validators.max(1)]],
      dithering: [null],
      flatShading: [null],
      side: [null],
      transparent: [null],
      type: [null],
      uuid: [null],
      vertexColors: [null],
      visible: [null],
      userData: [null],
    });
  }

  model = new MaterialFormAnnotation();

  side: {[key: string]: Side} = {
    FrontSide,
    BackSide,
    DoubleSide
  };

  shading: {[key: string]: Shading} = {
    FlatShading,
    SmoothShading
  };

  colors: {[key: string]: Colors} = {
    NoColors,
    FaceColors,
    VertexColors
  };

  blending: {[key: string]: Blending} = {
    NoBlending,
    NormalBlending,
    AdditiveBlending,
    SubtractiveBlending,
    MultiplyBlending,
    CustomBlending
  };

  blendingEquation: {[key: string]: BlendingEquation} = {
    AddEquation,
    SubtractEquation,
    ReverseSubtractEquation,
    MinEquation,
    MaxEquation
  };

  blendingDstFactor: {[key: string]: BlendingDstFactor} = {
    ZeroFactor,
    OneFactor,
    SrcColorFactor,
    OneMinusSrcColorFactor,
    SrcAlphaFactor,
    OneMinusSrcAlphaFactor,
    DstAlphaFactor,
    OneMinusDstAlphaFactor,
    DstColorFactor,
    OneMinusDstColorFactor
  };

  blendingSrcFactor: {[key: string]: BlendingSrcFactor} = {
    SrcAlphaSaturateFactor
  };

  DepthModes: {[key: string]: DepthModes} = {
    NeverDepth,
    AlwaysDepth,
    LessDepth,
    LessEqualDepth,
    EqualDepth,
    GreaterEqualDepth,
    GreaterDepth,
    NotEqualDepth
  };





  form;

  submitted = false;

  onSubmit() {
    this.submitted = true;
  }

  // TODO: Remove this when we're done
  get diagnostic() {
    return JSON.stringify(this.model);
  }

  ngOnInit() {
    // console.log(this.model)
    // for (let obj in this.model) {
    //   console.log(obj);
    // }
    // console.log(new MaterialForm());
  }
}

export class MaterialFormAnnotation implements Material, OnInit {

  ngOnInit(){

  }

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

  addEventListener(type: string, listener: (event: Event) => void): void {}

  hasEventListener(type: string, listener: (event: Event) => void): void {}

  removeEventListener(type: string, listener: (event: Event) => void): void {}

  dispatchEvent(event: { type: string; [p: string]: any }): void {}

  clone(): this {
    return null;
  }

  copy(material: this): this {
    return null;
  }

  dispose(): void {}

  setValues(values: MaterialParameters): void {}

  toJSON(meta?: any): any {
    return null;
  }

  update(): void {}
}
