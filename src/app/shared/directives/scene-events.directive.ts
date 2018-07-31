import {Directive, ElementRef, HostListener} from '@angular/core';
import {OnWindowEventService} from '@events/on-window-event.service';
import {KeyboardEventService} from '@events/keyboard-event.service';

@Directive({
  selector: '[adventureSceneEvents]'
})
export class SceneEventsDirective {
  constructor(
    private element: ElementRef,
    private keyboardEventService: KeyboardEventService,
    private onWindowEventService: OnWindowEventService
  ) {}

  @HostListener('mouseover')
  onMouseOver() {
    let punchEditor = this.element.nativeElement.querySelector('#scene');
    console.log(punchEditor);
  }

  @HostListener('document:keyup', ['$event'])
  onDocumentKeyUp(event: KeyboardEvent) {
    console.log(event);
    this.keyboardEventService.keyboardPressEvent(event);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    console.log(event);
    this.onWindowEventService.onResize(event);
  }
}
