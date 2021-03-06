import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SceneTestComponent } from '@modules/ui-interfaces/scene-test/scene-test.component';

const routes: Routes = [
  {
    path: '',
    component: SceneTestComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SceneTestRoutingModule {}
