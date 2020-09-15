import { Component, OnInit } from '@angular/core';
import {ChatComponent} from '../../chat/chat.component';

@Component({
  selector: 'app-mobile-conversation',
  templateUrl: './mobile-conversation.component.html',
  styleUrls: ['./mobile-conversation.component.scss']
})
export class MobileConversationComponent implements OnInit {
  MESSAGES;
  constructor(chat: ChatComponent) { 
    this.MESSAGES = chat.MESSAGES;
  }

  ngOnInit(): void {
  }

}
