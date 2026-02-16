import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatbotWindowComponent } from './chatbotWindow.component';

describe('ChatbotWindowComponent', () => {
  let component: ChatbotWindowComponent;
  let fixture: ComponentFixture<ChatbotWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatbotWindowComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatbotWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
