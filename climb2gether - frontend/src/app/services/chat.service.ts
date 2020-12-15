import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { BehaviorSubject, interval, Subject, Subscription } from 'rxjs';
import { map, repeatWhen, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Conversation } from '../_models/Conversation';
import { Message } from '../_models/Message';


@Injectable({
  providedIn: 'root'
})
export class ChatService {

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  conversations: Conversation[];
  activeConversationId: number;
  activeConversationChanged = new BehaviorSubject<number>(null);
  messages: Message[];

  messagesSubscription: Subscription;

  conversationsChanged = new BehaviorSubject<Conversation[]>([]);
  messagesChanged = new BehaviorSubject<Message[]>([]);

  constructor(
    private snackBar: MatSnackBar,
    private http: HttpClient
  ) { }

  openSnackBar(message: string) {
    const config = new MatSnackBarConfig();
    config.panelClass = ['snackBarStyle'];
    config.horizontalPosition = this.horizontalPosition;
    config.verticalPosition = this.verticalPosition;
    config.duration = 3000;
    this.snackBar.open(message, 'X', config);
  }

  fetchConversations(){
    return this.http.get(
      `${environment.apiUrl}/conversations`
    ).pipe(
      map(
        res => {
          return JSON.parse(JSON.stringify(res)) as Conversation[];
        }
      ), tap(res => {
        this.conversationsChanged.next(res);
      })
    ).toPromise();
  }

  fetchMessages(conversationId: number){
    this.messagesSubscription = this.http.get<Message[]>(
      `${environment.apiUrl}/messages/${conversationId}`
    ).pipe(
      repeatWhen(() => interval(3000))
    )
    .subscribe(res=> {
      this.messagesChanged.next(res);
    })
  }

  unsubscribeMessages(){
    if(this.messagesSubscription){
      this.messagesSubscription.unsubscribe();
    }
  }


  sendMessage(request: Message){
    
    return this.http.post(
      `${environment.apiUrl}/sendMessage`,
      request
    ).toPromise();
  }

  createOrFindConversation(userId: string){
    return this.http.post<{id: number, isNewConversation: boolean}>(
      `${environment.apiUrl}/conversations`,
      {User2Email: userId}
    ).toPromise();
  }
}
