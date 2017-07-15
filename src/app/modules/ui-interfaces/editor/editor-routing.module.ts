import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {EditorComponent} from "./editor.component";
import {ModalComponent} from "../../../shared/modal/modal.component";
import {HeightMapComponent} from "./height-map/height-map.component";

const routes: Routes = [
  {
    path: '',
    component: EditorComponent,
  },
  {
    path: 'inventory',
    component: ModalComponent,
    outlet: 'popup',
    children:[
      {
        path: '',
        component: HeightMapComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class EditorRoutingModule { }
