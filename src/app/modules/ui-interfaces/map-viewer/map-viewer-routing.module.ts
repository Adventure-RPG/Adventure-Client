import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapViewerComponent } from './map-viewer.component';
import { EngineModule } from "@modules/engine/engine.module";
import { SharedModule } from "@shared/shared-module.module";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: '',
    component: MapViewerComponent
  }
];


@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes),
    SharedModule
  ],
  exports: [RouterModule],
  providers: []
})
export class MapViewerRoutingModule { }
