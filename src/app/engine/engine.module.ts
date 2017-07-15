import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EngineService } from "./engine.service";

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    EngineService
  ],
  declarations: []
})
export class EngineModule { }
