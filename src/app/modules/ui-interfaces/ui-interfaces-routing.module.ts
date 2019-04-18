import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared-module.module';
import { ModalComponent } from '../../shared/modal/modal.component';
import { AuthGuard } from '../../guards/auth.guard';
import { SceneTestComponent } from '@modules/ui-interfaces/scene-test/scene-test.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'main',
        loadChildren: 'app/modules/ui-interfaces/main/main.module#MainModule'
        // canActivate: [AuthGuard]
      },
      {
        path: 'login',
        loadChildren: 'app/modules/ui-interfaces/login/login.module#LoginModule'
      },
      {
        path: 'arena',
        loadChildren: 'app/modules/ui-interfaces/arena/arena.module#ArenaModule'
        // canActivate: [AuthGuard]
      },
      {
        path: 'editor',
        loadChildren: 'app/modules/ui-interfaces/editor/editor.module#EditorModule'
        // canActivate: [AuthGuard]
      },
      {
        path: 'tavern',
        loadChildren: 'app/modules/ui-interfaces/tavern/tavern.module#TavernModule'
        // canActivate: [AuthGuard]
      },
      {
        path: '',
        loadChildren: 'app/modules/ui-interfaces/landing/landing.module#LandingModule'
      },
      {
        path: 'scene-test',
        loadChildren: 'app/modules/ui-interfaces/scene-test/scene-test.module#SceneTestModule'
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
