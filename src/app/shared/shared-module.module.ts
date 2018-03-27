import { NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { SelectModule } from 'angular2-select';

// import { provideComponentOutletModule} from "angular2-component-outlet";
import { ColorPickerModule } from 'ngx-color-picker';
import { MainButtonsControlComponent } from './main-buttons-control/main-buttons-control.component';
import { RouterModule} from "@angular/router";
import {SnotifyModule, SnotifyService, ToastDefaults} from "ng-snotify";
import {HttpClientModule} from "@angular/common/http";

const Modules = [
  CommonModule,
  FormsModule,
  RouterModule,
  ReactiveFormsModule,
  HttpClientModule,
  SelectModule,
  NgbModule,
  ColorPickerModule,
  SnotifyModule
];

const Services = [
];

const Components = [
  MainButtonsControlComponent
];

@NgModule({
  imports: [
    ...Modules
  ],
  declarations: [
    ...Components,
  ],
  providers: [
    ...Services,
    { provide: 'SnotifyToastConfig', useValue: ToastDefaults},
    SnotifyService
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  exports: [
    ...Modules,
    ...Components
  ]
})
export class SharedModule { }
