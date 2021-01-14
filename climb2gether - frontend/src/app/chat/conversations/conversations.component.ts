import { SelectionModel } from '@angular/cdk/collections';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatListOption, MatSelectionList } from '@angular/material/list';
import { Subscription } from 'rxjs';
import { BaseService } from 'src/app/services/base.service';
import { ChatService } from 'src/app/services/chat.service';
import { Conversation } from 'src/app/_models/Conversation';

@Component({
  selector: 'app-conversations',
  templateUrl: './conversations.component.html',
  styleUrls: ['./conversations.component.scss']
})
export class ConversationsComponent implements OnInit, OnDestroy {
  @ViewChild('conversationForm', { static: false }) conversationForm: NgForm;
  selectedOptions: string[] = [];
  conversationSubscription: Subscription;
  conversations: Conversation[];
  constructor(
    private chatService: ChatService,
    private baseService: BaseService
  ) { }

  async ngOnInit() {
    this.chatService.conversationsChanged.subscribe( res => {
      this.conversations = res;
    })
    this.conversationSubscription = this.chatService.conversationsChanged.subscribe(res => {
      this.conversations = res;
    });
    if(this.chatService.emailFromRedirectedProfile){
      this.onSubmit(this.chatService.emailFromRedirectedProfile);
      this.chatService.emailFromRedirectedProfile = null;
    }
  }

  private activeSelected(conversationId: number) {
    if(this.conversations.find(c => c.id == conversationId)){
      this.conversations.find(c => c.id == conversationId).haveUnreadedMessages = false;
    }
    this.chatService.activeConversationChanged.next(conversationId);
  }

  async onSubmit(email?: string) {
    const userEmail = email ? email : this.conversationForm.value.conversation;
    let result: { id: number, isNewConversation: boolean };
    if (userEmail) {
      await this.chatService.createOrFindConversation(userEmail)
        .then(res => {
          result = res;
        })
        .catch(err => {
          this.baseService.openSnackBar(err.error);
          return;
        });
      if(result){
        this.activeSelected(result.id);
        this.selectedOptions = [result.id.toString()];
      }


    }
    this.conversationForm.reset();
  }


  ngOnDestroy(): void {
    this.conversationSubscription.unsubscribe();
  }

}
