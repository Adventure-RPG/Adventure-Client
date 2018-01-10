import { TestBed, inject } from '@angular/core/testing';

import { HotkeysService } from './hotkeys.service';

describe('HotkeysService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HotkeysService]
    });
  });

  it('should be created', inject([HotkeysService], (service: HotkeysService) => {
    expect(service).toBeTruthy();
  }));
});
