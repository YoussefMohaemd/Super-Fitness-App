import { createReducer, on } from '@ngrx/store';
import { initialChatState, ChatbotRole } from './chatbot.state';
import * as ChatbotActions from './chatbot.actions';

export const chatbotReducers = createReducer(
  initialChatState,

  on(ChatbotActions.openChat, (state) => ({
    ...state,
    isOpen: true,
    isLoading: true,
  })),

  on(ChatbotActions.sendMessage, (state, { content }) => ({
    ...state,
    chatHistory: [...state.chatHistory, { role: ChatbotRole.USER, content }],
    isLoading: true,
  })),
  on(ChatbotActions.aiResponse, (state, { content }) => ({
    ...state,
    chatHistory: [...state.chatHistory, { role: ChatbotRole.AI, content }],
    isLoading: false,
  })),

  on(ChatbotActions.closeChat, () => initialChatState),

  on(ChatbotActions.clearChat, () => initialChatState)
);
