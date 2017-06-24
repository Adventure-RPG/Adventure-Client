import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryComponent } from './inventory.component';
import { InventoryRoutingModule } from "./inventory-routing.module";
import { BackpackComponent } from './backpack/backpack.component';

const Components = [
  InventoryComponent,
  BackpackComponent
];

@NgModule({
  imports: [
    InventoryRoutingModule,
    CommonModule,
  ],
  declarations: [Components],
  exports: [Components]
})
export class InventoryModule { }
