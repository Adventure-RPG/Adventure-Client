import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared-module.module';
import { ModalComponent } from '../../shared/modal/modal.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'main',
        loadChildren: () => import('./main/main.module').then(m => m.MainModule)
        // canActivate: [AuthGuard]
      },
      {
        path: 'login',
        loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
      },
      {
        path: 'arena',
        loadChildren: () => import('./arena/arena.module').then(m => m.ArenaModule)
        // canActivate: [AuthGuard]
      },
      {
        path: 'map-viewer',
        loadChildren: () => import('./map-viewer/map-viewer.module').then(m => m.MapViewerModule)
        // canActivate: [AuthGuard]
      },
      {
        path: 'editor',
        loadChildren: () => import('./editor/editor.module').then(m => m.EditorModule)
        // canActivate: [AuthGuard]
      },
      {
        path: 'tavern',
        loadChildren: () => import('./tavern/tavern.module').then(m => m.TavernModule)
        // canActivate: [AuthGuard]
      },
      {
        path: '',
        loadChildren: () => import('./landing/landing.module').then(m => m.LandingModule)
      },
      {
        path: 'scene-test',
        loadChildren: () => import('./scene-test/scene-test.module').then(m => m.SceneTestModule)
        // canActivate: [AuthGuard]
      }
    ]
  },
  {
    path: 'auth/confirm/:token',
    redirectTo: 'login/login-email-verification/:token'
  },
  // {
  //   path: 'inventory',
  //   component: SidebarModalComponent,
  //   loadChildren: 'app/modules/ui-interfaces/inventory/inventory.module#InventoryModule',
  //   outlet: 'sidebar'
  // },
  {
    path: 'editor',
    component: ModalComponent,
    outlet: 'popup',
    loadChildren: 'app/modules/ui-interfaces/sub/sub.module#SubModule'
  }
];

@NgModule({
  imports: [
    SharedModule,
    // RouterModule.forRoot(routes)
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
  providers: []
})
export class UiInterfacesRoutingModule {}
