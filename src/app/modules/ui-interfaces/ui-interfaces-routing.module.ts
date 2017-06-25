import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ModalComponent} from "../../shared/modal/modal.component";

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'main',
        loadChildren: 'app/modules/ui-interfaces/main/main.module#MainModule',
      },
      {
        path: 'login',
        loadChildren: 'app/modules/ui-interfaces/login/login.module#LoginModule'
      },
      {
        path: 'editor',
        loadChildren: 'app/modules/ui-interfaces/editor/editor.module#EditorModule'
      },
      {
        path: '',
        loadChildren: 'app/modules/ui-interfaces/landing/landing.module#LandingModule'
      }
    ],
  },
  {
    path: 'inventory',
    component: ModalComponent,
    loadChildren: 'app/modules/ui-interfaces/inventory/inventory.module#InventoryModule',
    outlet: 'sidebar'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { enableTracing: true })
  ],
  exports: [RouterModule],
  providers: []
})
export class UiInterfacesRoutingModule { }
