import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import {MainRoutingModule} from "./main-routing.module";
import {SharedModule} from "../../../shared/shared-module.module";

@NgModule({
  imports: [
    CommonModule,
    MainRoutingModule,
    SharedModule
  ],
  declarations: [MainComponent]
})
export class MainModule { }
