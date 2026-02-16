import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorizonbarComponent } from './horizonbar.component';

describe('HorizonbarComponent', () => {
  let component: HorizonbarComponent;
  let fixture: ComponentFixture<HorizonbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HorizonbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HorizonbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
