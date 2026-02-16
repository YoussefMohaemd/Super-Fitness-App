import { HeightComponent } from './height.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('HeightComponent', () => {
  let component: HeightComponent;
  let fixture: ComponentFixture<HeightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeightComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HeightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
