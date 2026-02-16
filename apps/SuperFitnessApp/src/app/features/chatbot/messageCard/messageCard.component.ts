import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatbotRole } from '../../../store/chatbot/chatbot.state';
import { SkeletonModule } from 'primeng/skeleton';
@Component({
  selector: 'app-message-card',
  imports: [CommonModule, SkeletonModule],
  templateUrl: './messageCard.component.html',
  styleUrl: './messageCard.component.scss',
})
export class MessageCardComponent {
  role = input<ChatbotRole>(ChatbotRole.AI);
  message = input<string>();
  isLoading = input<boolean>(false);
  userImage = input<string>('chat-human-pic.jpg');
  aiImage = input<string>('chat-ai-pic.jpg');

  get isUser() {
    return this.role() === ChatbotRole.USER;
  }
  get isAI() {
    return this.role() === ChatbotRole.AI;
  }
}
