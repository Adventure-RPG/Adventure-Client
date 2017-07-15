import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EngineService } from "./engine.service";
import {HeightMapService} from "./height-map.service";

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    EngineService,
    HeightMapService
  ],
  declarations: []
})
export class EngineModule { }
