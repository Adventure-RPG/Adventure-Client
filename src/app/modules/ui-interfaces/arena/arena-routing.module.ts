import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../../shared/shared-module.module';
import { ArenaComponent } from '@modules/ui-interfaces/arena/arena.component';

const routes: Routes = [
  {
    path: '',
    component: ArenaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  exports: [RouterModule],
  providers: []
})
export class ArenaRoutingModule {}
