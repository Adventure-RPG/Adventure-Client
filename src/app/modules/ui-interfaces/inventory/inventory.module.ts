import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryComponent } from './inventory.component';
import { InventoryRoutingModule } from "./inventory-routing.module";
import {BackpackComponent} from './backpack/backpack.component';
import { HeroItemsComponent } from './hero-items/hero-items.component';
import {VirtualScrollModule} from "angular2-virtual-scroll";
import {InventoryItemComponent} from "./backpack/lists/inventory-item.component";
import {MultiColListComponent} from "./backpack/lists/multi-col-list.component";
import {SlimScrollModule} from "ng2-slimscroll";

const Components = [
  InventoryComponent,
  BackpackComponent,
  HeroItemsComponent,
  MultiColListComponent,
  InventoryItemComponent
];

@NgModule({
  imports: [
    InventoryRoutingModule,
    CommonModule,
    VirtualScrollModule,
    SlimScrollModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  declarations: [Components],
  exports: [Components]
})
export class InventoryModule { }
