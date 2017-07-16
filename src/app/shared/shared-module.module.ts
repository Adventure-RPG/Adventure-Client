import { NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { SelectModule } from 'angular2-select';

import { ApiService } from "../services/api.service";
import { SidebarModalComponent } from './sidebar-modal/sidebar-modal.component'
import {ModalComponent} from "./modal/modal.component";
import {provideComponentOutletModule} from "angular2-component-outlet";

const Modules = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  HttpModule,
  SelectModule,
  NgbModule
];

const Services = [
  ApiService
];

const Components = [
  SidebarModalComponent,
  ModalComponent
];

@NgModule({
  imports: [
    ...Modules
  ],
  declarations: [
    ...Components
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
