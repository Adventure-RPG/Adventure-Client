import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArenaComponent } from './arena.component';
import { EngineModule } from '@modules/engine/engine.module';
import { SharedModule } from '@shared/shared-module.module';
import { ArenaRoutingModule } from '@modules/ui-interfaces/arena/arena-routing.module';
import { SpellWorkspaceComponent } from './extra/spell-workspace/spell-workspace.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { ModelLoaderComponent } from './extra/model-loader/model-loader.component';
import { LayersComponent } from './extra/layers/layers.component';
import { SaveComponent } from './extra/save/save.component';
import { LoadComponent } from './extra/load/load.component';

@NgModule({
  declarations: [ArenaComponent, SpellWorkspaceComponent, ModelLoaderComponent, LayersComponent, SaveComponent, LoadComponent],
  imports: [EngineModule, ArenaRoutingModule, SharedModule, CommonModule, NgZorroAntdModule],
  providers: [],
  exports: []
})
export class ArenaModule {}
