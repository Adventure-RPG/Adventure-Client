import {Component, OnInit} from '@angular/core';
import {EngineService} from '../../../engine/engine.service';

@Component({
  selector: 'adventure-models',
  templateUrl: './models.component.html',
  styleUrls: ['./models.component.scss']
})
export class ModelsComponent implements OnInit {
  models = [
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
    }
  ];

  constructor(private engineService: EngineService) {}

  loadFBX(url: string) {
    this.engineService.loadFBX(url);
  }

  ngOnInit() {}
}
