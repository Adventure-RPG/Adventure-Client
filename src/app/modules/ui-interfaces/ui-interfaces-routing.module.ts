import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SidebarModalComponent} from "../../shared/sidebar-modal/sidebar-modal.component";
import {SharedModule} from "../../shared/shared-module.module";
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
    component: SidebarModalComponent,
    loadChildren: 'app/modules/ui-interfaces/inventory/inventory.module#InventoryModule',
    outlet: 'sidebar'
  },
  {
    path: 'editor',
    component: ModalComponent,
    outlet: 'popup',
    loadChildren: 'app/modules/ui-interfaces/sub/sub.module#SubModule',
  }
];

@NgModule({
  imports: [
    SharedModule,
    // RouterModule.forRoot(routes)
    RouterModule.forRoot(routes )
  ],
  exports: [RouterModule],
  providers: []
})
export class UiInterfacesRoutingModule { }
