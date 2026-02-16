import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthyNutriComponent } from './healthy-nutri.component';

describe('HealthyNutriComponent', () => {
  let component: HealthyNutriComponent;
  let fixture: ComponentFixture<HealthyNutriComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HealthyNutriComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HealthyNutriComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
