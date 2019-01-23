import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PlayerRoutingModule} from './player-routing.module';
import {ToolbarComponent} from './toolbar/toolbar.component';
import {PlayerComponent} from './player.component';

@NgModule({
  imports: [CommonModule, PlayerRoutingModule],
  declarations: [ToolbarComponent, PlayerComponent]
})
export class PlayerModule {}
