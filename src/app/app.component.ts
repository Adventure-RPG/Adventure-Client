import {Component, HostListener} from '@angular/core';
import {RouterLinkActive, RouterLinkWithHref, RouterLink, RouterOutlet} from "@angular/router";
import {KeyboardEventService} from './events/keyboard-event.service';
import {OnWindowEventService} from './events/on-window-event.service';

@Component({
  selector: 'adventure-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  host: {
    '(window:resize)': 'handleResizeEvent($event)',
    '(document:keydown)': 'handleKeyboardEvent($event)'
  }
})
export class AppComponent {

  constructor(
    private keyboardEventService: KeyboardEventService,
    private onWindowEventService: OnWindowEventService
  ){

  }

  handleKeyboardEvent(event: KeyboardEvent) {
    this.keyboardEventService.keyboardPressEvent(event);
  }

  handleResizeEvent(event: Event){
    this.onWindowEventService.onResize(event);
  }

}
