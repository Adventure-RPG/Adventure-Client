import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeightMapService } from './core/3d-helpers/height-map.service';
import { SceneService } from './core/base/scene.service';
import { CameraService } from './core/base/camera.service';
import { ModelLoaderService } from '@modules/engine/core/base/model-loader.service';

@NgModule({
  imports: [CommonModule],
  providers: [HeightMapService, SceneService, CameraService],
  declarations: []
})
export class EngineModule {}
