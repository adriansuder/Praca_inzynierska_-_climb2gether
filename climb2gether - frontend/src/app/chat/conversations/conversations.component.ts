import { Component, Input, OnInit } from '@angular/core';
import { Conversation } from 'src/app/_models/Conversation';

@Component({
  selector: 'app-conversations',
  templateUrl: './conversations.component.html',
  styleUrls: ['./conversations.component.scss']
})
export class ConversationsComponent implements OnInit {

  @Input() conversations: Conversation[];
  constructor() { }

  ngOnInit() {
    console.log('xxxxxxxxxxxxxxxxxx');
    console.log(this.conversations);
  }

}
