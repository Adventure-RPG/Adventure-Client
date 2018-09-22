import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ColorPickerModule } from 'ngx-color-picker';
import { MainButtonsControlComponent } from './main-buttons-control/main-buttons-control.component';
import { RouterModule } from '@angular/router';
import { SnotifyModule, SnotifyService, ToastDefaults } from 'ng-snotify';
import { HttpClientModule } from '@angular/common/http';
import { SceneEventsDirective } from './directives/scene-events.directive';
import { NgSelectModule } from '@ng-select/ng-select';
import { NouisliderModule } from 'ng2-nouislider';
import { CheckboxComponent } from './form-components/checkbox/checkbox.component';
import { RangeComponent } from './form-components/range/range.component';
import { SanitizeHtmlDirective } from '@shared/directives/sanitize-html.directive';

const Modules = [
  CommonModule,
  FormsModule,
  RouterModule,
  ReactiveFormsModule,
  HttpClientModule,
  NgSelectModule,
  NgbModule,
  ColorPickerModule,
  SnotifyModule,
  NouisliderModule
];

const Services = [];

const Components = [MainButtonsControlComponent, CheckboxComponent, RangeComponent];

const Directive = [SceneEventsDirective, SanitizeHtmlDirective];

@NgModule({
  imports: [...Modules],
  declarations: [...Components, ...Directive],
  providers: [
    ...Services,
    { provide: 'SnotifyToastConfig', useValue: ToastDefaults },
    SnotifyService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [...Modules, ...Components, ...Directive]
})
export class SharedModule {}
