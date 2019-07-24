import {
  AddEquation,
  AdditiveBlending,
  AlwaysDepth,
  BackSide,
  Blending,
  BlendingDstFactor,
  BlendingEquation,
  BlendingSrcFactor,
  Colors,
  CustomBlending,
  DepthModes,
  DoubleSide,
  DstAlphaFactor,
  DstColorFactor,
  EqualDepth,
  FaceColors,
  FlatShading,
  FrontSide,
  GreaterDepth,
  GreaterEqualDepth,
  LessDepth,
  LessEqualDepth,
  MaxEquation,
  MinEquation,
  MultiplyBlending,
  NeverDepth,
  NoBlending,
  NoColors,
  NormalBlending,
  NotEqualDepth,
  OneFactor,
  OneMinusDstAlphaFactor,
  OneMinusDstColorFactor,
  OneMinusSrcAlphaFactor,
  OneMinusSrcColorFactor,
  ReverseSubtractEquation,
  Side,
  SmoothShading,
  SrcAlphaFactor,
  SrcAlphaSaturateFactor,
  SrcColorFactor,
  SubtractEquation,
  SubtractiveBlending,
  VertexColors,
  ZeroFactor
} from 'three';

import { Shading } from 'three';

export class MaterialEnum {
  static side: { [key: string]: Side } = {
    FrontSide,
    BackSide,
    DoubleSide
  };

  static shading: { [key: string]: Shading } = {
    FlatShading,
    SmoothShading
  };

  static colors: { [key: string]: Colors } = {
    NoColors,
    FaceColors,
    VertexColors
  };

  static blending: { [key: string]: Blending } = {
    NoBlending,
    NormalBlending,
    AdditiveBlending,
    SubtractiveBlending,
    MultiplyBlending,
    CustomBlending
  };

  static blendingEquation: { [key: string]: BlendingEquation } = {
    AddEquation,
    SubtractEquation,
    ReverseSubtractEquation,
    MinEquation,
    MaxEquation
  };

  static blendingDstFactor: { [key: string]: BlendingDstFactor } = {
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

  static blendingSrcFactor: { [key: string]: BlendingSrcFactor } = {
    SrcAlphaSaturateFactor
  };

  static depthModes: { [key: string]: DepthModes } = {
    NeverDepth,
    AlwaysDepth,
    LessDepth,
    LessEqualDepth,
    EqualDepth,
    GreaterEqualDepth,
    GreaterDepth,
    NotEqualDepth
  };

  static precision: { [key: string]: number } = {
    highp: 1,
    mediump: 2,
    lowp: 3
  };
}
