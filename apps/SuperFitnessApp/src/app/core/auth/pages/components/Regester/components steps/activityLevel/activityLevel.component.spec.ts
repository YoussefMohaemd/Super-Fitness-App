import { ActivityLevelComponent } from './activityLevel.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('ActivityLevelComponent', () => {
  let component: ActivityLevelComponent;
  let fixture: ComponentFixture<ActivityLevelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityLevelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ActivityLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
