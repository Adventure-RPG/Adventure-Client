import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapViewerComponent } from './map-viewer.component';
import { EngineModule } from "@modules/engine/engine.module";
import { SharedModule } from "@shared/shared-module.module";
import { MapViewerRoutingModule } from "@modules/ui-interfaces/map-viewer/map-viewer-routing.module";



@NgModule({
  declarations: [MapViewerComponent],
  imports: [
    EngineModule, SharedModule, CommonModule, MapViewerRoutingModule
  ]
})
export class MapViewerModule { }
