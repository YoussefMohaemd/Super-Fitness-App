import { Component, ElementRef, QueryList, ViewChildren, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import {   Router } from '@angular/router';
import { AuthApiService } from 'projects/auth-api/src/lib/auth-api.service';

enum Step {
  Email = 'Email',
  Otp = 'Otp',
  Reset = 'Reset',
}

@Component({
  selector: 'app-forget-pass',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ],
  templateUrl: './forget-pass.component.html',
  styleUrls: ['./forget-pass.component.scss'],
})
export class ForgetPassComponent {
  private ngUnsubscribe = new Subject<void>();
  private _authApiService = inject(AuthApiService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  Step = Step;
  currentStep: Step = Step.Email;

  emailForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  otpForm: FormGroup = this.fb.group({
    digit1: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
    digit2: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
    digit3: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
    digit4: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
    digit5: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
    digit6: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]]
  });

 resetForm = this.fb.group(
  {
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required]
  },
  { validators: this.passwordMatchValidator }
);


  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;

  errorMessage = '';
  successMessage = '';

submitEmail() {
  if (this.emailForm.invalid) return;

  const email = this.emailForm.get('email')?.value || '';

  this._authApiService.Forgetpass({ email })
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
      next: () => {
        this.errorMessage = '';
        this.successMessage = '';
        this.currentStep = Step.Otp;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to send reset email.';
        this.successMessage = '';
      }
    });
}


submitOtp() {
  if (this.otpForm.invalid) return;

  const code = Object.values(this.otpForm.value).join('');
  const email = this.emailForm.get('email')?.value || '';

  this._authApiService.VerifyCode({ code, email })
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
      next: () => {
        this.errorMessage = '';
        this.currentStep = Step.Reset;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Invalid code.';
        this.successMessage = '';
      }
    });
}


 submitReset() {
  if (this.resetForm.invalid) return;

  const email = this.emailForm.get('email')?.value || '';
  const newPassword = this.resetForm.get('newPassword')?.value || '';

  this._authApiService.resetpass({
    email,
    newPassword
  })
  .pipe(takeUntil(this.ngUnsubscribe))
  .subscribe({
    next: () => {
      this.errorMessage = '';
      this.successMessage = 'Password reset successfully.';
      this.currentStep = Step.Email;
      this.emailForm.reset();
      this.otpForm.reset();
      this.resetForm.reset();
      this.router.navigate(['/auth/login']);
    },
    error: (err) => {
      this.errorMessage = err.error?.message || 'Failed to reset password.';
      this.successMessage = '';
    }
  });
}



  moveToNext(event: any, nextInput: number) {
    const input = event.target;
    if (input.value.length === 1 && nextInput < 6) {
      this.otpInputs.toArray()[nextInput].nativeElement.focus();
    }
    if (event.inputType === 'deleteContentBackward' && nextInput > 0 && !input.value) {
      this.otpInputs.toArray()[nextInput - 1].nativeElement.focus();
    }
  }
passwordMatchValidator(form: FormGroup) {
  const password = form.get('newPassword')?.value;
  const confirmPassword = form.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { mismatch: true };
}

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
