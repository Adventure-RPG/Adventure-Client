import { TestBed, inject } from '@angular/core/testing';

import { HeightMapService } from './height-map.service';

describe('HeightMapService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HeightMapService]
    });
  });

  it('should be created', inject([HeightMapService], (service: HeightMapService) => {
    expect(service).toBeTruthy();
  }));
});
