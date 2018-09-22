import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { WebsocketIoService } from '@modules/ui-interfaces/tavern/chat/websocket-io.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  messages: Subject<any>;

  // Our constructor calls our wsService connect method
  constructor(private wsService: WebsocketIoService) {
    this.messages = <Subject<any>>wsService.connect().pipe(
      map(
        (response: any): any => {
          return response;
        }
      )
    );
  }

  // Our simplified interface for sending
  // messages back to our socket.io server
  sendMsg(msg) {
    this.messages.next(msg);
  }
}
