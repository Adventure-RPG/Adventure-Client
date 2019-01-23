import { inject, TestBed } from '@angular/core/testing';

import { WebsocketIoService } from './websocket-io.service';

describe('WebsocketIoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WebsocketIoService]
    });
  });

  it('should be created', inject([WebsocketIoService], (service: WebsocketIoService) => {
    expect(service).toBeTruthy();
  }));
});
