import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubRoutingModule } from './sub-routing.module';
import {DndModule} from "ng2-dnd";
import {EngineModule} from "../../engine/engine.module";
import {HeightMapComponent} from "./height-map/height-map.component";
import { LayersComponent } from './layers/layers.component';

@NgModule({
  imports: [
    CommonModule,
    EngineModule,

    SubRoutingModule,
    DndModule.forRoot()
  ],
  declarations: [
    HeightMapComponent,
    LayersComponent
  ]
})
export class SubModule { }
