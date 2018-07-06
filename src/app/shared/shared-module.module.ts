import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SelectModule } from 'angular2-select';

// import { provideComponentOutletModule} from "angular2-component-outlet";
import { ColorPickerModule } from 'ngx-color-picker';
import { MainButtonsControlComponent } from './main-buttons-control/main-buttons-control.component';
import { RouterModule } from '@angular/router';
import { SnotifyModule, SnotifyService, ToastDefaults } from 'ng-snotify';
import { HttpClientModule } from '@angular/common/http';
import { SceneEventsDirective } from './directives/scene-events.directive';
import { NgSelectModule } from "@ng-select/ng-select";
import {IonRangeSliderModule} from "ng2-ion-range-slider";

const Modules = [
  CommonModule,
  FormsModule,
  RouterModule,
  ReactiveFormsModule,
  HttpClientModule,
  NgSelectModule,
  NgbModule,
  ColorPickerModule,
  IonRangeSliderModule,
  SnotifyModule
];

const Services = [];

const Components = [MainButtonsControlComponent];

const Directive = [SceneEventsDirective];

@NgModule({
  imports: [...Modules],
  declarations: [...Components, ...Directive],
  providers: [...Services, { provide: 'SnotifyToastConfig', useValue: ToastDefaults }, SnotifyService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [...Modules, ...Components, ...Directive]
})
export class SharedModule {}
