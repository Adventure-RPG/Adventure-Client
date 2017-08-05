import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UiInterfacesRoutingModule } from './ui-interfaces-routing.module';
import {SharedModule} from "../../shared/shared-module.module";
import {SubModule} from "./sub/sub.module";

@NgModule({
  imports: [
    CommonModule,
    UiInterfacesRoutingModule,
    SubModule,
    SharedModule,
  ],
  providers: [],
  declarations: [ ]
})
export class UiInterfacesModule { }
