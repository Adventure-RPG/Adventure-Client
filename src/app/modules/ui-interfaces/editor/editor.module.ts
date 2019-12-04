import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditorRoutingModule } from './editor-routing.module';
import { EditorComponent } from './editor.component';
import { EngineModule } from '../../engine/engine.module';
import { SharedModule } from '@shared/shared-module.module';

@NgModule({
  imports: [CommonModule, EngineModule, EditorRoutingModule, SharedModule],
  providers: [],
  declarations: [EditorComponent],
  exports: []
})
export class EditorModule {}
