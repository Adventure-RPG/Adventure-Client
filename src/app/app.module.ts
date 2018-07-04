import { BrowserModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import 'hammerjs';

import { AppComponent } from './app.component';

/* Modules */
import { SharedModule } from './shared/shared-module.module';
import { UiInterfacesRoutingModule } from './modules/ui-interfaces/ui-interfaces-routing.module';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
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
import { SceneEventsDirective } from './shared/directives/scene-events.directive';
import { AuthGuard } from './guards/auth.guard';
import { LoginService } from './modules/ui-interfaces/login/login.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './guards/auth.interceptor';

export class MyHammerConfig extends HammerGestureConfig {
  overrides = <any>{
    swipe: { velocity: 0.4, threshold: 20 } // override default settings
  };
}

const Modules = [BrowserModule, SharedModule, UiInterfacesModule, UiInterfacesRoutingModule];

const ModulesForRoot = [NgbModule];

const ModulesForRootImport = [NgbModule.forRoot()];

const Components = [SidebarModalComponent, ModalComponent];

const Events = [KeyboardEventService, MouseEventService, OnWindowEventService];

const Services = [HandleErrorService, SettingsService, EngineService, LightService, AppService, ApiService, LoginService];

const Guards = [AuthGuard];

const Directive = [SceneEventsDirective];

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
    }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [...ModulesForRoot, ...Components],
  bootstrap: [AppComponent]
})
export class AppModule {}
