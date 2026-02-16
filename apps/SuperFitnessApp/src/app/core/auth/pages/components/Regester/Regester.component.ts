import { AuthApiService } from '../../../../../../../../../projects/auth-api/src/lib/auth-api.service';
import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidatorFn,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AccountFormComponent } from './components steps/Account-form/account-form.component';
import { GenderComponent } from './components steps/gender/gender.component';
import { AgeComponent } from './components steps/age/age.component';
import { WeightComponent } from './components steps/weight/weight.component';
import { HeightComponent } from './components steps/height/height.component';
import { GoalComponent } from './components steps/goal/goal.component';
import { ActivityLevelComponent } from './components steps/activityLevel/activityLevel.component';
import { registerUser } from 'projects/auth-api/src/lib/interface/register';

@Component({
  selector: 'app-regester',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AccountFormComponent,
    GenderComponent,
    AgeComponent,
    WeightComponent,
    HeightComponent,
    GoalComponent,
    ActivityLevelComponent,
  ],
  templateUrl: './Regester.component.html',
  styleUrls: ['./Regester.component.scss'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  loading = false;
  errorMessage = '';

  // Picker ranges
  readonly ages = this.range(10, 99);
  readonly weights = this.range(30, 149);
  readonly heights = this.range(100, 219);

  steps = ['Account', 'Gender', 'Age', 'Weight', 'Height', 'Goal', 'Activity'];
  currentStep = signal(0);

  private destroy$ = new Subject<void>();
  private readonly router = inject(Router);
  private readonly authService = inject(AuthApiService);
  private readonly fb = inject(FormBuilder);

  ngOnInit() {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.form = this.fb.group(
      {
        fname: ['', [Validators.required, Validators.minLength(2)]],
        lname: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        repassword: ['', [Validators.required]],
        gender: [null, Validators.required],
        age: [18, Validators.required],
        weight: [70, Validators.required],
        height: [150, Validators.required],
        goal: [null, Validators.required],
        activityLevel: [null, Validators.required],
      },
      { validators: RegisterComponent.passwordMatchValidator }
    );
  }

  // Utility function to create ranges
  private range(start: number, end: number): number[] {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  // Common picker logic
  getSelectedIndex(list: number[], value: number): number {
    return list.findIndex((v) => v === value);
  }

  onPick(value: number, controlName: string): void {
    this.form.get(controlName)?.setValue(value);
  }

  positionClass(list: number[], value: number, idx: number): string {
    const selectedIndex = this.getSelectedIndex(list, value);
    const diff = idx - selectedIndex;
    if (diff === 0) return 'center';
    if (diff > 0 && diff <= 3) return `r${diff}`;
    if (diff < 0 && diff >= -3) return `l${Math.abs(diff)}`;
    return 'hidden';
  }

  // Age methods
  get selectedAgeIndex(): number {
    return this.getSelectedIndex(this.ages, this.form.value.age);
  }
  onPickAge(age: number): void {
    this.onPick(age, 'age');
  }
  positionClassAge(idx: number): string {
    return this.positionClass(this.ages, this.form.value.age, idx);
  }

  // Weight methods
  get selectedWeightIndex(): number {
    return this.getSelectedIndex(this.weights, this.form.value.weight);
  }
  onPickWeight(weight: number): void {
    this.onPick(weight, 'weight');
  }
  positionClassWeight(idx: number): string {
    return this.positionClass(this.weights, this.form.value.weight, idx);
  }

  // Height methods
  get selectedHeightIndex(): number {
    return this.getSelectedIndex(this.heights, this.form.value.height);
  }
  onPickHeight(height: number): void {
    this.onPick(height, 'height');
  }
  positionClassHeight(idx: number): string {
    return this.positionClass(this.heights, this.form.value.height, idx);
  }

  static passwordMatchValidator: ValidatorFn = (control: AbstractControl) => {
    const password = control.get('password')?.value;
    const repassword = control.get('repassword')?.value;
    return password === repassword ? null : { mismatch: true };
  };

  isFirstStep(): boolean {
    return this.currentStep() === 0;
  }

  isLastStep(): boolean {
    return this.currentStep() === this.steps.length - 1;
  }

  next(): void {
    if (this.formStepValid() && !this.isLastStep()) {
      this.currentStep.update((value) => value + 1);
    }
  }

  prev(): void {
    if (!this.isFirstStep()) {
      this.currentStep.update((value) => value - 1);
    }
  }

  private stepControls(): string[][] {
    return [
      ['fname', 'lname', 'email', 'password', 'repassword'],
      ['gender'],
      ['age'],
      ['weight'],
      ['height'],
      ['goal'],
      ['activityLevel'],
    ];
  }

  formStepValid(): boolean {
    const controls = this.stepControls()[this.currentStep()];
    const allValid = controls.every((key) => this.form.get(key)?.valid);
    return allValid && !this.form.hasError('mismatch');
  }

  submit(): void {
    if (this.form.invalid) return;

    this.loading = true;
    const payload: registerUser = {
      firstName: this.form.value.fname,
      lastName: this.form.value.lname,
      email: this.form.value.email,
      password: this.form.value.password,
      rePassword: this.form.value.repassword,
      gender: this.form.value.gender,
      weight: this.form.value.weight,
      height: this.form.value.height,
      age: this.form.value.age,
      goal: this.form.value.goal,
      activityLevel: this.form.value.activityLevel,
    };

    this.authService
      .Regester(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.router.navigate(['/auth/login']),
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
