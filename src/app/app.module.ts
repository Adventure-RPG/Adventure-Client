import { BrowserModule, HAMMER_GESTURE_CONFIG, HammerGestureConfig } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import 'hammerjs';

import { AppComponent } from './app.component';
/* Modules */
import { SharedModule } from './shared/shared-module.module';
import { UiInterfacesRoutingModule } from './modules/ui-interfaces/ui-interfaces-routing.module';

import { UiInterfacesModule } from './modules/ui-interfaces/ui-interfaces.module';
import { ModalComponent } from './shared/modal/modal.component';
import { SidebarModalComponent } from './shared/sidebar-modal/sidebar-modal.component';
import { EngineService } from './modules/engine/engine.service';
import { LightService } from './modules/engine/core/light.service';
import { SettingsService } from './services/settings.service';
import { KeyboardEventService } from './events/keyboard-event.service';
import { MouseEventService } from './events/mouse-event.service';
import { OnWindowEventService } from './events/on-window-event.service';
import { AppService } from './app.service';
import { ApiService } from './services/api.service';
import { HandleErrorService } from './services/handle-error.service';
import { AuthGuard } from './guards/auth.guard';
import { LoginService } from './modules/ui-interfaces/login/login.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './guards/auth.interceptor';
import { StorageService } from './services/storage.service';
import { ModelLoaderService } from '@modules/engine/core/base/model-loader.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
/** config angular i18n **/
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';

registerLocaleData(en);

export class MyHammerConfig extends HammerGestureConfig {
  overrides = <any>{
    swipe: { velocity: 0.4, threshold: 20 } // override default settings
  };
}

const Modules = [
  BrowserModule,
  BrowserAnimationsModule,
  SharedModule,
  HttpClientModule,
  UiInterfacesModule,
  UiInterfacesRoutingModule,
];

const ModulesForRoot = [];

const ModulesForRootImport = [];

const Components = [SidebarModalComponent, ModalComponent];

const Events = [KeyboardEventService, MouseEventService, OnWindowEventService];

const Services = [
  HandleErrorService,
  SettingsService,
  EngineService,
  LightService,
  AppService,
  ApiService,
  LoginService,
  StorageService,
  //TODO: разобраться почему модел лоадер не работает на уровне engine.module
  ModelLoaderService
];

const Guards = [AuthGuard];

@NgModule({
  imports: [...Modules, ...ModulesForRootImport],
  declarations: [AppComponent, ...Components],
  providers: [
    ...Events,
    ...Services,
    ...Guards,
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: MyHammerConfig
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    { provide: NZ_I18N, useValue: en_US },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [...ModulesForRoot, ...Components],
  bootstrap: [AppComponent]
})
export class AppModule {}
