import { Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-chatbot-input',
  imports: [
    CommonModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    ButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './chatbotInput.component.html',
  styleUrl: './chatbotInput.component.scss',
})
export class ChatbotInputComponent {
  onSend = output<string>();

  formObj = new FormGroup({
    prompt: new FormControl(''),
  });

  sendMessage() {
    console.log('Sending message:', this.formObj.value.prompt);
    this.onSend.emit(this.formObj.value.prompt!);
    this.formObj.reset();
  }
}
