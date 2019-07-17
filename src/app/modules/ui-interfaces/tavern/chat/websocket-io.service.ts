import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { environment } from '../../../../../environments/environment';
import { Observable, Subject } from 'rxjs/index';

const WebSocketConfigDefault = {
  reconnection: true,
  reconnectionDelay: 2000, //starts with 2 secs delay, then 4, 6, 8, until 60 where it stays forever until it reconnects
  reconnectionDelayMax: 60000, //1 minute maximum delay between connections
  timeout: 10000,
  transports: ['websocket'],
  upgrade: false
};

@Injectable({
  providedIn: 'root'
})
export class WebsocketIoService {
  // Our socket connection
  private socket;

  constructor() {}

  connect(): Subject<MessageEvent> {
    // If you aren't familiar with environment variables then
    // you can hard code `environment.ws_url` as `http://localhost:5000`
    this.socket = io(environment.chat_service, {
      ...WebSocketConfigDefault
    });

    // We define our observable which will observe any incoming messages
    // from our socket.io server.
    let observable = new Observable((observer) => {
      this.socket.on('message', (data) => {
        console.log('Received message from Websocket Server');
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });

    this.socket.on('connect', () => {
      this.socket.emit('auth', {
        token: JSON.parse(window.localStorage.getItem('auth'))['access_token']
      });
    });

    // We define our Observer which will listen to messages
    // from our other components and send messages back to our
    // socket server whenever the `next()` method is called.
    let observer = {
      next: (value: any) => {
        if (typeof value === 'object') {
          for (let key in value) {
            this.socket.emit(key, value[key]);
          }
        } else {
          this.socket.emit(value);
        }
      }
    };

    // we return our Rx.Subject which is a combination
    // of both an observer and observable.
    return Subject.create(observer, observable);
  }
}
