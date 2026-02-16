import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FitnessClassComponent } from './fitness-class.component';

describe('FitnessClassComponent', () => {
  let component: FitnessClassComponent;
  let fixture: ComponentFixture<FitnessClassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FitnessClassComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FitnessClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
