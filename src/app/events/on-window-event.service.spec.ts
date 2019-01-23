import {inject, TestBed} from '@angular/core/testing';

import {OnWindowEventService} from './on-window-event.service';

describe('OnWindowEventService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OnWindowEventService]
    });
  });

  it('should be created', inject([OnWindowEventService], (service: OnWindowEventService) => {
    expect(service).toBeTruthy();
  }));
});
