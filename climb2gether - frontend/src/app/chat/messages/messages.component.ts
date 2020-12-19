import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Component, ElementRef, Input, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { interval, Subscription } from 'rxjs';
import { repeatWhen } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { BaseService } from 'src/app/services/base.service';
import { ChatService } from 'src/app/services/chat.service';
import { Message } from 'src/app/_models/Message';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit, OnDestroy {
  @ViewChild('messageForm', { static: false }) messageForm: NgForm;
  @ViewChild(CdkVirtualScrollViewport) public virtualScroll?: CdkVirtualScrollViewport;

  messages: Message[] = [];
  activeConversationSub: Subscription;
  messagesChanged: Subscription;
  activeConversation: number;
  userId: number;

  scrollDownCounter: number = 0;

  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private baseService: BaseService
  ) { }


  async ngOnInit() {
    this.userId = this.authService.loggedUser.userId;
    this.activeConversationSub = await this.chatService.activeConversationChanged.subscribe(x => {
      if (x) {
        this.activeConversation = x;
        this.chatService.unsubscribeMessages();
        this.chatService.fetchMessages(x);
      }
      this.messagesChanged = this.chatService.messagesChanged.subscribe(res => {
        this.messages = res;
        if(this.virtualScroll?.measureScrollOffset('bottom') < 150 || this.virtualScroll?.measureScrollOffset('top') == 0 ){
          
          this.scrollToBottom();
        }
        console.log(this.virtualScroll?.measureScrollOffset('bottom'))
      });
    });
   
  }


  trackBy(index, item){
    return index;
  }

  scrollToBottom() {
    try {
      this.virtualScroll.scrollTo({bottom: 0});
    } catch (e) {
      console.log(e)
      
    }
  }

  // async fetchMessages(conversationId: number) {
  //   this.messages = await this.chatService.fetchMessages(conversationId);
  //   console.log('yyyyy')
  //   console.log(this.messages)
  // }

  ngOnDestroy() {
    this.activeConversationSub.unsubscribe();
    this.chatService.unsubscribeMessages();
    this.messagesChanged.unsubscribe();
    this.activeConversation = null;
  }

  async onSubmit() {
    let message = this.messageForm.value.message;
    if (message != null || message !== '') {
      var requestMessage: Message = {
        text: message,
        userId: this.authService.loggedUser.userId,
        conversationId: this.activeConversation
      }

      var result = await this.chatService.sendMessage(requestMessage);
      if (!result) {
        this.baseService.openSnackBar('Nie udało się wysłać wiadomości, spróbuj jeszcze raz.');
        return;
      }

      this.scrollToBottom();

      this.messageForm.reset();
    }

  }
}
