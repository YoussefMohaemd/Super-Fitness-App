import { TestBed } from '@angular/core/testing';

import { ChatbotManagerService } from './chatbot-manager.service';

describe('ChatbotManagerService', () => {
  let service: ChatbotManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatbotManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
