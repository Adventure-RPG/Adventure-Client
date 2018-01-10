import { TestBed, inject } from '@angular/core/testing';

import { KeyboardEventService } from './keyboard-event.service';

describe('KeyboardEventService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KeyboardEventService]
    });
  });

  it('should be created', inject([KeyboardEventService], (service: KeyboardEventService) => {
    expect(service).toBeTruthy();
  }));
});
