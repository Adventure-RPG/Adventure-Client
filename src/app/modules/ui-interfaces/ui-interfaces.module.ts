import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UiInterfacesRoutingModule } from './ui-interfaces-routing.module';
import {SharedModule} from "../../shared/shared-module.module";

@NgModule({
  imports: [
    CommonModule,
    UiInterfacesRoutingModule,
    SharedModule,
  ],
  declarations: [ ]
})
export class UiInterfacesModule { }
