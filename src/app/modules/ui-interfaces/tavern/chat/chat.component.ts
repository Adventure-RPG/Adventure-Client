import { Component, OnInit } from '@angular/core';
import { ChatService } from '@modules/ui-interfaces/tavern/chat/chat.service';

const TYPING_TIMER_LENGTH = 400; // ms

@Component({
  selector: 'adventure-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  message: string;
  messages: any[] = [];

  // TODO
  connected: boolean = true;
  typing: boolean = false;
  lastTypingTime;

  constructor(public chat: ChatService) {}

  ngOnInit() {
    this.chat.connect();
    // this.chat.sendMsg({auth: {ololo: this.message}});
    this.chat.messages.subscribe((msg) => {
      this.messages.push({ msg: msg, userId: 0 });
      console.log(this.messages);
    });

    setTimeout(() => {
      this.getServerTime();
    }, 1000 * 10);
  }

  sendMessage() {
    this.chat.sendMsg({ message: { text: this.message } });
    this.message = '';
  }

  typingMessage(typing: number) {
    this.typing = false;
    this.chat.sendMsg({ typing: typing });
  }

  getServerTime() {
    this.chat.sendMsg({ datetime: { time: new Date().getTime() } });
  }

  leaveFromChat() {
    this.chat.sendMsg({ leave: true });
  }

  updateTyping = () => {
    if (this.connected) {
      if (!this.typing) {
        this.typingMessage(1);
      }

      this.lastTypingTime = new Date().getTime();

      setTimeout(() => {
        let typingTimer = new Date().getTime();
        let timeDiff = typingTimer - this.lastTypingTime;
        if (timeDiff >= TYPING_TIMER_LENGTH && this.typing) {
          this.typingMessage(0);
        }
      }, TYPING_TIMER_LENGTH);
    }
  };
}
