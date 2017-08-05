import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HeightMapComponent} from "./height-map/height-map.component";
import {LayersComponent} from "./layers/layers.component";

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
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubRoutingModule { }
