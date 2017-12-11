import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HeightMapService} from "./height-map.service";
import {LightService} from "./light.service";


@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    HeightMapService,
  ],
  declarations: []
})
export class EngineModule { }
