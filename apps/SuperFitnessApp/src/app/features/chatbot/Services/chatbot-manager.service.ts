import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { GoogleGenAI } from '@google/genai';

@Injectable({
  providedIn: 'root',
})
export class ChatbotManagerService {
  private readonly geminiApiKey: string = environment.GEMINI_API_KEY;
  private readonly geminiModel: string = 'gemini-2.0-flash';
  private readonly geminiConfig = {
    temperature: 0.5,
    maxOutputTokens: 1024,
  };

  private readonly genAI: GoogleGenAI;

  constructor() {
    this.genAI = new GoogleGenAI({
      apiKey: this.geminiApiKey,
    });
  }

  initChatSesstion() {}

  sendMessage(){

  }

  setAIResponse(){

  }


}
