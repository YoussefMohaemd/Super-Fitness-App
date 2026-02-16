import {
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatbotInputComponent } from '../chatbotInput/chatbotInput.component';
import { GoogleGenAI, Chat } from '@google/genai';
import { environment } from '../../../environments/environment.development';
import * as ChatbotSelectors from '../../../store/chatbot/chatbot.selectors';
import * as ChatbotActions from '../../../store/chatbot/chatbot.actions';
import { Store } from '@ngrx/store';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  Observable,
  Subject,
  take,
  takeUntil,
  timeout,
  timer,
} from 'rxjs';
import { ChatMessage } from '../../../store/chatbot/chatbot.state';
import { MessageCardComponent } from '../messageCard/messageCard.component';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
@Component({
  selector: 'app-chatbot-window',
  imports: [CommonModule, ChatbotInputComponent, MessageCardComponent],
  templateUrl: './chatbotWindow.component.html',
  styleUrl: './chatbotWindow.component.scss',
})
export class ChatbotWindowComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  private readonly geminiApiKey: string = environment.GEMINI_API_KEY;
  private readonly geminiModel: string = 'gemini-2.0-flash';
  private readonly geminiConfig = {
    temperature: 0.5,
    maxOutputTokens: 1024,
  };

  @ViewChild('messagesView') messagesViewRef!: ElementRef<HTMLDivElement>;

  private chatModal!: Chat;
  chatHistory$!: Observable<ChatMessage[]>;
  isLoading$!: Observable<boolean>;

  isOpen: boolean = false;
  chatMessagesList: ChatMessage[] = [] as ChatMessage[];

  private readonly destroy$ = new Subject<void>();
  private readonly _store = inject(Store);
  private readonly _apiKey = this.geminiApiKey;
  private readonly genAI = new GoogleGenAI({ apiKey: this._apiKey });

  initGeminiChatModal() {
    this.chatModal = this.getChat();
  }

  getChat(): Chat {
    return this.genAI.chats.create({
      model: this.geminiModel,
      config: this.geminiConfig,
      history: [],
    });
  }

  startChat() {
    setTimeout(() => {
      this.sendMessage('Hello', true);
    }, 1000);
  }

  sendMessage(message: string, isAutoMsg: boolean = false) {
    if (!isAutoMsg) {
      this.setUserResponse(message);
    }

    // send user message to AI
    this.chatModal
      .sendMessage({
        message: message,
      })
      .then((response) => {
        //save AI response
        if (response.text) {
          this.setAIResponse(response.text);
        }
      });
  }

  setUserResponse(msg: string) {
    this._store.dispatch(ChatbotActions.sendMessage({ content: msg }));
  }

  setAIResponse(res: string) {
    this._store.dispatch(ChatbotActions.aiResponse({ content: res }));
  }

  trackChatHistory() {
    this._store
      .select(ChatbotSelectors.chatHistory)
      .pipe(takeUntil(this.destroy$))
      .subscribe((val) => {
        this.chatMessagesList = val;
        if (this.isOpen) {
          setTimeout(() => this.scrollToBottom(), 0);
        }
      });
  }

  trackLoading() {
    this.isLoading$ = this._store.select(ChatbotSelectors.loadingStatus);
  }

  trackChatStatus() {
    this._store
      .select(ChatbotSelectors.isOpen)
      .pipe(takeUntil(this.destroy$))
      .subscribe((val) => {
        this.isOpen = val;
        if (this.isOpen) {
          this.startChat();
        }
      });
  }

  ngAfterViewInit(): void {}

  scrollToBottom(): void {
    const el = this.messagesViewRef?.nativeElement;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    } else {
      console.warn('messagesViewRef not found');
    }
  }

  ngOnInit(): void {
    this.initGeminiChatModal();
    this.trackChatHistory();
    this.trackLoading();
    this.trackChatStatus();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
