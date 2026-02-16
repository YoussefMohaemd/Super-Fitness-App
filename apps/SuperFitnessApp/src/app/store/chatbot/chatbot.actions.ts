import { createAction, props } from '@ngrx/store';

export const sendMessage = createAction(
  '[Chatbot] Send Message',
  props<{ content: string }>()
);

export const aiResponse = createAction(
  '[Chatbot] AI Response',
  props<{ content: string }>()
);

export const openChat = createAction('[Chatbot] Open Chat');

// export const closeChat = createAction('[Chatbot] Close Chat');

export const closeChat = createAction('[Chatbot] Close Chat');

export const clearChat = createAction('[Chatbot] Clear Chat');

export const toggleReadyStatus = createAction('[Chatbot] Toggle Ready Status');
