import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TavernComponent} from './tavern.component';
import {TavernRoutingModule} from '@modules/ui-interfaces/tavern/tavern-routing.module';
import {SharedModule} from '@shared/shared-module.module';
import {ChatComponent} from './chat/chat.component';

@NgModule({
  imports: [CommonModule, TavernRoutingModule, SharedModule],
  declarations: [TavernComponent, ChatComponent]
})
export class TavernModule {}
