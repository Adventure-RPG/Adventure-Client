import { NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { SelectModule } from 'angular2-select';

import { ApiService } from "../services/api.service";
import { SidebarModalComponent } from './sidebar-modal/sidebar-modal.component'
import { ModalComponent} from "./modal/modal.component";
import { provideComponentOutletModule} from "angular2-component-outlet";
import { ColorPickerModule} from "angular4-color-picker/lib/color-picker.module";
import { MainButtonsControlComponent } from './main-buttons-control/main-buttons-control.component';
import { RouterModule} from "@angular/router";

const Modules = [
  CommonModule,
  FormsModule,
  RouterModule,
  ReactiveFormsModule,
  HttpModule,
  SelectModule,
  NgbModule,
  ColorPickerModule
];

const Services = [
  ApiService
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
    provideComponentOutletModule({
      imports: [CommonModule]
    })
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
