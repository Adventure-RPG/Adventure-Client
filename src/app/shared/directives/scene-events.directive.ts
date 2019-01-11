import { Directive, ElementRef, HostListener } from '@angular/core';
import { OnWindowEventService } from '@events/on-window-event.service';
import { KeyboardEventService } from '@events/keyboard-event.service';
import { MouseEventService } from '@events/mouse-event.service';

const debugEvents = {
  mouseEvents: {
    mousedown: true,
    mouseup: false,
    mousemove: false,
    click: false,
    dbclick: false,
    mouseover: false,
    mouseout: false,
    mouseenter: false,
    mouseleave: false,
    contextmenu: false
  },
  keyboardEvents: {
    keydown: false,
    keyup: false
  },
  resize: false
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

  private currentElement;

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    if (debugEvents.mouseEvents.mousedown) {
      console.log(event);
    }
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    if (debugEvents.mouseEvents.mouseup) {
      console.log(event);
    }
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (debugEvents.mouseEvents.mousemove) {
      console.log(event);
    }
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    if (debugEvents.mouseEvents.click) {
      console.log(event);
    }
  }

  @HostListener('dbclick', ['$event'])
  onDoubleClick(event: MouseEvent) {
    if (debugEvents.mouseEvents.dbclick) {
      console.log(event);
    }
  }

  @HostListener('mouseover', ['$event'])
  onMouseOver(event: MouseEvent) {
    if (debugEvents.mouseEvents.mouseover) {
      console.log(event);
    }
  }

  @HostListener('mouseout', ['$event'])
  onMouseOut(event: MouseEvent) {
    if (debugEvents.mouseEvents.mouseout) {
      console.log(event);
    }
  }

  /**
   * Добавил выделение элемента с помощью mouseenter и mouseleave. Если совпадает с элементом объявленным
   * в element.nativeElement, то пропускает keyboard ивенты.
   * Необходимо для разделения событийной логики связанной с элементами.
   */
  @HostListener('mouseenter', ['$event'])
  onMouseEnter(event: MouseEvent) {
    if (debugEvents.mouseEvents.mouseenter) {
      console.log(event);
    }
    this.currentElement = event.target;
  }

  @HostListener('mouseleave', ['$event'])
  onMouseLeave(event: MouseEvent) {
    if (debugEvents.mouseEvents.mouseleave) {
      console.log(event);
    }
    this.currentElement = null;
  }

  @HostListener('contextmenu', ['$event'])
  onContextmenu(event: MouseEvent) {
    if (debugEvents.mouseEvents.contextmenu) {
      console.log(event);
    }
  }

  @HostListener('document:keydown', ['$event'])
  onDocumentKeyDown(event: KeyboardEvent) {
    if (this.element.nativeElement === this.currentElement) {
      if (debugEvents.keyboardEvents.keydown) {
        console.log(event);
      }
      this.keyboardEventService.keyboardPressEvent(event);
    }
  }

  @HostListener('document:keyup', ['$event'])
  onDocumentKeyUp(event: KeyboardEvent) {
    if (this.element.nativeElement === this.currentElement) {
      if (debugEvents.keyboardEvents.keyup) {
        console.log(event);
      }
      this.keyboardEventService.keyboardPressEvent(event);
    }
  }

  //Вынести в глобальные ивенты
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    if (debugEvents.keyboardEvents) {
      console.log(event);
    }
    this.onWindowEventService.onResize(event);
  }
}
