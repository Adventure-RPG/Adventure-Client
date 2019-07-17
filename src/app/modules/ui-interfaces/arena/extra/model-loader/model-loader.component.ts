import { Component, OnInit } from '@angular/core';
import {ModelLoaderService} from "@modules/engine/core/base/model-loader.service";
import {BoxGeometry, Mesh, MeshPhongMaterial} from "three";

export interface Model{
  name: string,
  path: string,
  [propName: string]: any;
}


@Component({
  selector: 'adventure-model-loader',
  templateUrl: './model-loader.component.html',
  styleUrls: ['./model-loader.component.scss']
})
export class ModelLoaderComponent implements OnInit {

  selectedModel;

  models: Model[] = [
    {
      name: 'xsi_man_skinning.fbx',
      path: '/assets/models/custom/xsi_man_skinning.fbx',
      texturePath: '/assets/models/custom/Char_UV_Texture.gif',
      animationIndex: 0
    },
    {
      name: 'SM_Bld_Castle_Door_01.fbx',
      path: '/assets/models/polygon-knights/Models/SM_Bld_Castle_Door_01.fbx',
      texturePath: '/assets/models/polygon-knights/Textures/Texture_01_Dark.png'
    },
    {
      name: 'Samba Dancing.fbx',
      path: '/assets/models/custom/Samba Dancing.fbx'
    }
  ];

  constructor(private modelLoaderService: ModelLoaderService) {}

  load(model: Model) {
    this.modelLoaderService.loadModel(model);
  }

  ngOnInit() {}

}
