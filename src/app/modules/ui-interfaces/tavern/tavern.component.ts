import { Component, OnInit } from '@angular/core';
import * as io from 'socket.io-client';

@Component({
  selector: 'adventure-tavern',
  templateUrl: './tavern.component.html',
  styleUrls: ['./tavern.component.scss']
})
export class TavernComponent implements OnInit {
  socket;

  constructor() {}

  ngOnInit() {
  }
}
