import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatbotFloatingComponent } from './chatbotFloating.component';
import { Component } from '@angular/core';

describe('ChatbotFloatingComponent', () => {
  let component: ChatbotFloatingComponent;
  let fixture: ComponentFixture<ChatbotFloatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatbotFloatingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatbotFloatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
