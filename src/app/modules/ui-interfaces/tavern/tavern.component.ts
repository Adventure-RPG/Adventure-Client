import { Component, OnInit } from '@angular/core';
import io from 'socket.io-client';


@Component({
  selector: 'adventure-tavern',
  templateUrl: './tavern.component.html',
  styleUrls: ['./tavern.component.scss']
})
export class TavernComponent implements OnInit {


  socket;

  constructor() { }

  ngOnInit() {
    this.socket = io('http://localhost:9999');
    this.socket.on('connect', function(){});
    this.socket.on('event', function(data){});
    this.socket.on('disconnect', function(){});
  }

}
