import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HeightMapComponent} from "./height-map/height-map.component";
import {LayersComponent} from "./layers/layers.component";
import {ModelsComponent} from "./models/models.component";
import {LightsComponent} from "./lights/lights.component";

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'heightMap',
        component: HeightMapComponent
      },
      {
        path: 'layers',
        component: LayersComponent
      },
      {
        path: 'models',
        component: ModelsComponent
      },
      {
        path: 'lights',
        component: LightsComponent
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubRoutingModule { }
