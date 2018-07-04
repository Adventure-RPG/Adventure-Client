import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditorComponent } from './editor.component';
import { SharedModule } from '../../../shared/shared-module.module';

const routes: Routes = [
  {
    path: '',
    component: EditorComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  exports: [RouterModule],
  providers: []
})
export class EditorRoutingModule {}
