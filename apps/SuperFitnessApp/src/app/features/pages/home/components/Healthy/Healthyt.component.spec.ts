import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HealthytComponent } from './Healthyt.component';

describe('HealthytComponent', () => {
  let component: HealthytComponent;
  let fixture: ComponentFixture<HealthytComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HealthytComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HealthytComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
