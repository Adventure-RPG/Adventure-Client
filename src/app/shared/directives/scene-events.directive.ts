import {Directive, ElementRef, HostListener, Input} from '@angular/core';
import { OnWindowEventService } from '@events/on-window-event.service';
import { KeyboardEventService } from '@events/keyboard-event.service';
import { MouseEventService } from '@events/mouse-event.service';

const debugEvents = {
  mouseEvents: {
    mousedown: false,
    mouseup: false,
    mousemove: false,
    click: false,
    dbclick: false,
    mouseover: false,
    mouseout: false,
    mouseenter: false,
    mouseleave: false,
    contextmenu: false,
    mousewheel: false
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

  @Input('enabledEvents') enabledEvents = {
    mouseEvents: {
      mousedown: true,
      mouseup: true,
      mousemove: true,
      click: true,
      dbclick: true,
      mouseover: true,
      mouseout: true,
      mouseenter: true,
      mouseleave: true,
      contextmenu: true,
      mousewheel: true
    },
    keyboardEvents: {
      keydown: true,
      keyup: true
    },
    resize: true
  };

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
    if (this.enabledEvents.mouseEvents.mousedown) {
      this.mouseEventService.mouseEvents(event);
    }
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    if (debugEvents.mouseEvents.mouseup) {
      console.log(event);
    }
    if (this.enabledEvents.mouseEvents.mouseup) {
      this.mouseEventService.mouseEvents(event);
    }
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (debugEvents.mouseEvents.mousemove) {
      console.log(event);
    }
    this.mouseEventService.mouseEvents(event);
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    if (debugEvents.mouseEvents.click) {
      console.log(event);
    }
    if (this.enabledEvents.mouseEvents.mouseup) {

    }
  }

  @HostListener('dbclick', ['$event'])
  onDoubleClick(event: MouseEvent) {
    if (debugEvents.mouseEvents.dbclick) {
      console.log(event);
    }
    if (this.enabledEvents.mouseEvents.dbclick) {
      console.log(event);
    }
  }

  @HostListener('mouseover', ['$event'])
  onMouseOver(event: MouseEvent) {
    if (debugEvents.mouseEvents.mouseover) {
      console.log(event);
    }
    if (this.enabledEvents.mouseEvents.mouseover) {
      console.log(event);
    }
  }

  @HostListener('mouseout', ['$event'])
  onMouseOut(event: MouseEvent) {
    if (debugEvents.mouseEvents.mouseout) {
      console.log(event);
    }
    if (this.enabledEvents.mouseEvents.mouseout) {
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
    if (this.enabledEvents.mouseEvents.mouseenter) {
      this.currentElement = event.target;
    }
  }

  @HostListener('mouseleave', ['$event'])
  onMouseLeave(event: MouseEvent) {
    if (debugEvents.mouseEvents.mouseleave) {
      console.log(event);
    }
    if (this.enabledEvents.mouseEvents.mouseleave) {
      this.currentElement = null;
    }
  }

  @HostListener('contextmenu', ['$event'])
  onContextmenu(event: MouseEvent) {
    if (debugEvents.mouseEvents.contextmenu) {
      console.log(event);
    }
    if (this.enabledEvents.mouseEvents.contextmenu) {
      console.log(event);
    }
  }

  @HostListener('mousewheel', ['$event'])
  onMouseWheel(event: MouseEvent) {
    if (debugEvents.mouseEvents.mousewheel) {
      console.log(event);
    }
    if (this.enabledEvents.mouseEvents.mousewheel) {
      this.mouseEventService.mouseEvents(event);
    }
  }

  @HostListener('document:keydown', ['$event'])
  onDocumentKeyDown(event: KeyboardEvent) {
    if (this.element.nativeElement === this.currentElement) {
      if (debugEvents.keyboardEvents.keydown) {
        console.log(event);
      }
      if (this.enabledEvents.keyboardEvents.keydown) {
        this.keyboardEventService.keyboardPressEvent(event);
      }
    }
  }

  @HostListener('document:keyup', ['$event'])
  onDocumentKeyUp(event: KeyboardEvent) {
    // console.log(this.enabledEvents)
    // console.log(this.element.nativeElement)
    // console.log(this.currentElement)
    // if (this.element.nativeElement === this.currentElement) {
      if (debugEvents.keyboardEvents.keyup) {
        console.log(event);
      }
      console.log(event);
      if (this.enabledEvents.keyboardEvents.keyup) {
        this.keyboardEventService.keyboardPressEvent(event);
      }
    // }
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
