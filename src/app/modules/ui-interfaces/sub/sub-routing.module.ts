import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HeightMapComponent} from "./height-map/height-map.component";
import {LayersComponent} from "./layers/layers.component";
import {ModelsComponent} from "./models/models.component";
import {LightsComponent} from "./lights/lights.component";
import {LightMapComponent} from "./light-map/light-map.component";
import {ColorMapComponent} from "./color-map/color-map.component";
import {MaterialFormComponent} from "./material/material.component";

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'height-map',
        component: HeightMapComponent
      },
      {
        path: 'layers',
        component: LayersComponent
      },
      {
        path: 'light-map',
        component: LightMapComponent
      },
      {
        path: 'color-map',
        component: ColorMapComponent
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
        path: 'material',
        component: MaterialFormComponent
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
