import { TestBed, inject } from '@angular/core/testing';

import { FunctionStorageService } from './function-storage.service';

describe('FunctionStorageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FunctionStorageService]
    });
  });

  it('should be created', inject([FunctionStorageService], (service: FunctionStorageService) => {
    expect(service).toBeTruthy();
  }));
});
