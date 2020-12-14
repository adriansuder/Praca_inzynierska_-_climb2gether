import { Component, OnInit } from '@angular/core';
import { Message } from '../_models/Message';
import { Conversation } from '../_models/Conversation';
import { ChatService } from '../services/chat.service';
import { AuthService } from '../auth/auth.service';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})

export class ChatComponent implements OnInit {
   date = new Date();
   conversations: Conversation[] = [];
   activeConversationId: number;
   messages: Message[] = [];
 
  constructor(
    private chatService: ChatService,
    private auth: AuthService
  ) { }

  async ngOnInit() {
    this.conversations = await this.chatService.fetchConversations();
  }

  createConversation(){

  }
}
