import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SceneTestRoutingModule } from './scene-test-routing.module';
import { SceneTestComponent } from '@modules/ui-interfaces/scene-test/scene-test.component';

@NgModule({
  declarations: [SceneTestComponent],
  imports: [CommonModule, SceneTestRoutingModule]
})
export class SceneTestModule {}
