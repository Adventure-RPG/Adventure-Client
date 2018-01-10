import { TestBed, inject } from '@angular/core/testing';

import { LightService } from './light.service';

describe('LightService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LightService]
    });
  });

  it('should be created', inject([LightService], (service: LightService) => {
    expect(service).toBeTruthy();
  }));
});
