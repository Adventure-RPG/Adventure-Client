import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArenaComponent } from './arena.component';
import {EngineModule} from "@modules/engine/engine.module";
import {SharedModule} from "@shared/shared-module.module";
import {ArenaRoutingModule} from "@modules/ui-interfaces/arena/arena-routing.module";

@NgModule({
  declarations: [ArenaComponent],
  imports: [
    EngineModule, ArenaRoutingModule, SharedModule,
    CommonModule
  ],
  providers: [],
  exports: []
})
export class ArenaModule { }
