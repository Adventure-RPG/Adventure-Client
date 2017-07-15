import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditorRoutingModule } from './editor-routing.module';
import { EditorComponent } from './editor.component';
import { EngineModule } from "../../../engine/engine.module";
import { EngineService } from "../../../engine/engine.service";

@NgModule({
  imports: [
    CommonModule,
    EngineModule,
    EditorRoutingModule
  ],
  providers:[
    EngineService
  ],
  declarations: [EditorComponent]
})
export class EditorModule { }
