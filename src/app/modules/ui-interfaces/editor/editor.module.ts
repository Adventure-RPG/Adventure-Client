import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditorRoutingModule } from './editor-routing.module';
import { EditorComponent } from './editor.component';
import { EngineModule } from "../../engine/engine.module";
import { EngineService } from "../../engine/engine.service";
import { DragulaModule } from "ng2-dragula";
import { HeightMapComponent } from './height-map/height-map.component';
import { SharedModule } from "../../../shared/shared-module.module";
import {ModalComponent} from "../../../shared/modal/modal.component";
import {DndModule} from "ng2-dnd";

@NgModule({
  imports: [
    CommonModule,
    EngineModule,
    EditorRoutingModule,
    SharedModule,
    DndModule.forRoot(),
    DragulaModule
  ],
  providers:[
    EngineService
  ],
  declarations: [
    EditorComponent,
    HeightMapComponent,
    ModalComponent
  ]
})
export class EditorModule { }
