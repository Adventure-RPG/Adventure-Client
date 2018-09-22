import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TavernComponent } from '@modules/ui-interfaces/tavern/tavern.component';

const routes: Routes = [
  {
    path: '',
    component: TavernComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class TavernRoutingModule {}
