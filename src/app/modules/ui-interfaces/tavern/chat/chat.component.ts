import { Component, OnInit } from '@angular/core';
import {ChatService} from "@modules/ui-interfaces/tavern/chat/chat.service";

@Component({
  selector: 'adventure-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  message: string;
  messages: any[] = [];

  constructor(public chat: ChatService){ }

  ngOnInit() {
    this.chat.messages
      .subscribe(msg => {
        this.messages.push({msg: msg, userId: 0})
      console.log(this.messages);
    })
  }

  sendMessage() {
    this.chat.sendMsg(this.message);
    this.message = '';
  }



}
