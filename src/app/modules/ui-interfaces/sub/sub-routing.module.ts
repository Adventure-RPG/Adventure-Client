import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HeightMapComponent} from "./height-map/height-map.component";

const routes: Routes = [
  {
    path: '',
    component: HeightMapComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubRoutingModule { }
