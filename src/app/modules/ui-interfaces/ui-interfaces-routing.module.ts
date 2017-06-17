import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadChildren: 'app/modules/ui-interfaces/landing/landing.module#LandingModule'
      },
      {
        path: 'main',
        loadChildren: 'app/modules/ui-interfaces/main/main.module#MainModule'
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
        path: 'game',
        loadChildren: 'app/modules/ui-interfaces/login/login.module#LoginModule'
      }
    ],

  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class UiInterfacesRoutingModule { }
