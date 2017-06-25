import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {InventoryComponent} from "./inventory.component";
import {BackpackComponent} from "./backpack/backpack.component";
import {HeroItemsComponent} from "./hero-items/hero-items.component";

const routes: Routes = [
  {
    path: '',
    component: InventoryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class InventoryRoutingModule { }
