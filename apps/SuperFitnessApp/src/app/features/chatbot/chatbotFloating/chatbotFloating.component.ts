import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatbotWindowComponent } from '../chatbotWindow/chatbotWindow.component';
import { Store } from '@ngrx/store';
import * as ChatbotActions from '../../../store/chatbot/chatbot.actions';
import * as ChatbotSelectors from '../../../store/chatbot/chatbot.selectors';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-chatbot-floating',
  imports: [CommonModule, ChatbotWindowComponent],
  templateUrl: './chatbotFloating.component.html',
  styleUrl: './chatbotFloating.component.scss',
})
export class ChatbotFloatingComponent implements OnInit {
  private readonly _store = inject(Store);
  chatStatus$!: Observable<boolean>;
  chatIsReady$!: Observable<boolean>;

  startChat() {
    this._store.dispatch(ChatbotActions.openChat());
  }

  closeChat() {
    this._store.dispatch(ChatbotActions.closeChat());
  }

  trackChatStatus() {
    this.chatStatus$ = this._store.select(ChatbotSelectors.isOpen);
  }

  ngOnInit() {
    this.trackChatStatus();
  }
}
