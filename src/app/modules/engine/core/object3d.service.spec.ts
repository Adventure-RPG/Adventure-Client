import { inject, TestBed } from '@angular/core/testing';

import { Object3dService } from './object3d.service';

describe('Object3dService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Object3dService]
    });
  });

  it('should be created', inject([Object3dService], (service: Object3dService) => {
    expect(service).toBeTruthy();
  }));
});
