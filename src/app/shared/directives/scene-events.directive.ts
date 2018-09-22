import { Directive, ElementRef, HostListener } from '@angular/core';
import { OnWindowEventService } from '@events/on-window-event.service';
import { KeyboardEventService } from '@events/keyboard-event.service';
import { MouseEventService } from '@events/mouse-event.service';

const debugEvents = {
  mouseEvents: false,
  keyboardEvents: false
};

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
    if (debugEvents.mouseEvents) {
      console.log(event);
    }
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    if (debugEvents.mouseEvents) {
      console.log(event);
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (debugEvents.mouseEvents) {
      console.log(event);
    }
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    if (debugEvents.mouseEvents) {
      console.log(event);
    }
  }

  @HostListener('document:dbclick', ['$event'])
  onDoubleClick(event: MouseEvent) {
    if (debugEvents.mouseEvents) {
      console.log(event);
    }
  }

  @HostListener('document:mouseover', ['$event'])
  onMouseOver(event: MouseEvent) {
    if (debugEvents.mouseEvents) {
      console.log(event);
    }
  }

  @HostListener('document:mouseout', ['$event'])
  onMouseOut(event: MouseEvent) {
    if (debugEvents.mouseEvents) {
      console.log(event);
    }
  }

  @HostListener('document:mouseenter', ['$event'])
  onMouseEnter(event: MouseEvent) {
    if (debugEvents.mouseEvents) {
      console.log(event);
    }
  }

  @HostListener('document:mouseleave', ['$event'])
  onMouseLeave(event: MouseEvent) {
    if (debugEvents.mouseEvents) {
      console.log(event);
    }
  }

  @HostListener('document:contextmenu', ['$event'])
  onContextmenu(event: MouseEvent) {
    if (debugEvents.mouseEvents) {
      console.log(event);
    }
  }

  @HostListener('document:keydown', ['$event'])
  onDocumentKeyDown(event: KeyboardEvent) {
    if (debugEvents.keyboardEvents) {
      console.log(event);
    }
    this.keyboardEventService.keyboardPressEvent(event);
  }

  @HostListener('document:keyup', ['$event'])
  onDocumentKeyUp(event: KeyboardEvent) {
    if (debugEvents.keyboardEvents) {
      console.log(event);
    }
    this.keyboardEventService.keyboardPressEvent(event);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    if (debugEvents.keyboardEvents) {
      console.log(event);
    }
    this.onWindowEventService.onResize(event);
  }
}
