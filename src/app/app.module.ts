import { BrowserModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import 'hammerjs';


import { AppComponent } from './app.component';

/* Modules */
import { SharedModule } from './shared/shared-module.module';
import { UiInterfacesRoutingModule } from "./modules/ui-interfaces/ui-interfaces-routing.module";

import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {UiInterfacesModule} from "./modules/ui-interfaces/ui-interfaces.module";
import {CommonModule} from "@angular/common";
import {ModalComponent} from "./shared/modal/modal.component";
import {SidebarModalComponent} from "./shared/sidebar-modal/sidebar-modal.component";

export class MyHammerConfig extends HammerGestureConfig  {
  overrides = <any>{
    'swipe': {velocity: 0.4, threshold: 20} // override default settings
  }
}

const Modules = [
  BrowserModule,
  SharedModule,
  UiInterfacesModule,
  UiInterfacesRoutingModule
];

const ModulesForRoot = [
  NgbModule
];

const ModulesForRootImport = [
  NgbModule.forRoot(),
];

@NgModule({
  imports: [
    ...Modules,
    ...ModulesForRootImport
  ],
  declarations: [
    AppComponent
  ],
  providers: [
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: MyHammerConfig
    }
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  exports: [
    ...ModulesForRoot
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
