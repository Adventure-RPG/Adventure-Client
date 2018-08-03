import { Directive, ElementRef, HostListener } from '@angular/core';
import { OnWindowEventService } from '@events/on-window-event.service';
import { KeyboardEventService } from '@events/keyboard-event.service';
import { MouseEventService } from '@events/mouse-event.service';

@Directive({
  selector: '[adventureSceneEvents]'
})
export class SceneEventsDirective {
  constructor(
    private element: ElementRef,
    private keyboardEventService: KeyboardEventService,
    private mouseEventService: MouseEventService,
    private onWindowEventService: OnWindowEventService
  ) {}

  //TODO: разобраться с ивентами, Что бы работали только над сценой -
  //TODO: наверно трабл в document: - должно быть не документ, либо его передавать

  @HostListener('document:mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    console.log(event);
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    console.log(event);
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    console.log(event);
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    console.log(event);
  }

  @HostListener('document:dbclick', ['$event'])
  onDoubleClick(event: MouseEvent) {
    console.log(event);
  }

  @HostListener('document:mouseover', ['$event'])
  onMouseOver(event: MouseEvent) {
    console.log(event);
  }

  @HostListener('document:mouseout', ['$event'])
  onMouseOut(event: MouseEvent) {
    console.log(event);
  }

  @HostListener('document:mouseenter', ['$event'])
  onMouseEnter(event: MouseEvent) {
    console.log(event);
  }

  @HostListener('document:mouseleave', ['$event'])
  onMouseLeave(event: MouseEvent) {
    console.log(event);
  }

  @HostListener('document:contextmenu', ['$event'])
  onContextmenu(event: MouseEvent) {
    console.log(event);
  }

  @HostListener('document:keydown', ['$event'])
  onDocumentKeyDown(event: KeyboardEvent) {
    console.log(event);
    this.keyboardEventService.keyboardPressEvent(event);
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
