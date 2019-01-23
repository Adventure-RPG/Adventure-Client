import {inject, TestBed} from '@angular/core/testing';

import {MouseEventService} from './mouse-event.service';

describe('MouseEventService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MouseEventService]
    });
  });

  it('should be created', inject([MouseEventService], (service: MouseEventService) => {
    expect(service).toBeTruthy();
  }));
});
