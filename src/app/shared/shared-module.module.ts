import { NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { SelectModule } from 'angular2-select';

import { ApiService } from "../services/api.service"


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

@NgModule({
  imports: [
    ...Modules
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  declarations: [
  ],
  providers: [
    ...Services
  ],
  exports: [
    ...Modules
  ]
})
export class SharedModule { }
