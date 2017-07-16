import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InventoryComponent } from "./inventory.component";
import {SharedModule} from "../../../shared/shared-module.module";

const routes: Routes = [
  {
    path: '',
    component: InventoryComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule
  ],
  exports: [RouterModule],
  providers: []
})
export class InventoryRoutingModule { }
