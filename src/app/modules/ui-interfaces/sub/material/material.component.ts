import { Component, OnInit } from '@angular/core';
import {
  Blending,
  BlendingDstFactor,
  BlendingEquation,
  BlendingSrcFactor,
  Colors,
  DepthModes,
  Material,
  MaterialParameters,
  Side
} from 'three';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import 'reflect-metadata';
import { Utils } from '../../../../utils/utils';
import { MaterialEnum } from '../../../../enums/material.enum';

// Validation methods

@Component({
  selector: 'adventure-material',
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.scss']
})
export class MaterialFormComponent implements OnInit {
  public colors = Utils.enumToArray(MaterialEnum.colors);
  public blending = Utils.enumToArray(MaterialEnum.blending);
  public blendingEquation = Utils.enumToArray(MaterialEnum.blendingEquation);
  public blendingDstFactor = Utils.enumToArray(MaterialEnum.blendingDstFactor);
  public blendingSrcFactor = Utils.enumToArray(MaterialEnum.blendingSrcFactor);
  public depthModes = Utils.enumToArray(MaterialEnum.depthModes);
  public side = Utils.enumToArray(MaterialEnum.side);
  public shading = Utils.enumToArray(MaterialEnum.shading);
  public precision = Utils.enumToArray(MaterialEnum.precision);

  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      alphaTest: [0, [Validators.required, Validators.min(0), Validators.max(1)]],
      blendDst: [null],
      blendDstAlpha: [0, [Validators.required, Validators.min(0), Validators.max(1)]],
      blendEquation: [null],
      blendEquationAlpha: [0, [Validators.required, Validators.min(0), Validators.max(1)]],
      blending: [null],
      blendSrc: [null],
      blendSrcAlpha: [0, [Validators.required, Validators.min(0), Validators.max(1)]],
      clipIntersection: [null],
      clippingPlanes: [null],
      clipShadows: [null],
      colorWrite: [null],
      depthFunc: [null],
      depthTest: [null],
      depthWrite: [null],
      fog: [null],
      isMaterial: [null],
      lights: [null],
      name: [null],
      needsUpdate: [null],
      opacity: [0, [Validators.required, Validators.min(0), Validators.max(1)]],
      overdraw: [0, [Validators.required, Validators.min(0), Validators.max(1)]],
      polygonOffset: [null],
      polygonOffsetFactor: [null],
      polygonOffsetUnits: [null],
      precision: [null],
      premultipliedAlpha: [0, [Validators.required, Validators.min(0), Validators.max(1)]],
      dithering: [null],
      flatShading: [null],
      side: [null],
      transparent: [null],
      vertexColors: [null],
      visible: [null],
      userData: [null]
    });
  }

  model = new MaterialFormAnnotation();

  //TODO: удалить

  form: FormGroup;

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
  ngOnInit() {}

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
