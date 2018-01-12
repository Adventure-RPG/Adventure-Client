import {Component, HostListener} from '@angular/core';
import {RouterLinkActive, RouterLinkWithHref, RouterLink, RouterOutlet} from "@angular/router";
import {KeyboardEventService} from './events/keyboard-event.service';

@Component({
  selector: 'adventure-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  host: {
    '(document:keydown)': 'handleKeyboardEvent($event)'
  }
})
export class AppComponent {

  constructor(private keyboardEventService: KeyboardEventService){

  }

  @HostListener('document:keypress', ['$event'])

  handleKeyboardEvent(event: KeyboardEvent) {
    this.keyboardEventService.keyboardPressEvent(event);
  }
}
