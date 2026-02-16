import { UpdateUserProfileData } from './../../../../../../../projects/auth-api/src/lib/interface/updateUserProfile';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeManagerService } from 'apps/SuperFitnessApp/src/app/core/services/ThemeManger/ThemeManagerService.service';
import { TranslateManagerService } from 'apps/SuperFitnessApp/src/app/core/services/TranslateManger/translate-manager-service.service';import { AuthApiService } from 'projects/auth-api/src/lib/auth-api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  standalone: true,
  imports: [DialogModule, TranslateModule,ButtonModule, InputTextModule, ReactiveFormsModule, CommonModule, DropdownModule, FormsModule],
})
export class UserProfileComponent implements OnInit {

  constructor() { }
  themeVal: boolean = false;
  langVal: boolean = false;
  fetchIsDone = false;

  private readonly _themeManager = inject(ThemeManagerService); 
  private readonly _translateManager = inject(TranslateManagerService);
  private readonly _authApiService = inject(AuthApiService);
  private readonly _router= inject(Router)
  private readonly fb = inject(FormBuilder);

  // Password reset dialog state
  showResetDialog = false;
  resetForm: FormGroup = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(8)]],
    newPassword: ['', [Validators.required, Validators.minLength(8)]]
  });
  resetLoading = false;
  resetError = '';
  resetSuccess = '';
  resetAttempted = false;
  showPassword = false;
  showNewPassword = false;
  showPasswordChangeSuccess = false;

  userProfile: UpdateUserProfileData | null = null;
  showEditPopup = false;
  editField: 'goal' | 'level' | 'weight' | null = null;
  editForm: FormGroup = this.fb.group({
    goal: [''],
    level: [''],
    weight: ['']
  });
  goalOptions = [
    { label: 'Gain Weight', value: 'Gain Weight' },
    { label: 'Lose Weight', value: 'Lose Weight' },
    { label: 'Get Fitter', value: 'Get Fitter' },
    { label: 'Gain More Flexible', value: 'Gain More Flexible' },
    { label: 'Learn The Basic', value: 'Learn The Basic' }
  ];
  levelOptions = [
    { label: 'Rookie', value: 'Rookie' },
    { label: 'Beginner', value: 'Beginner' },
    { label: 'Intermediate', value: 'Intermediate' },
    { label: 'Advance', value: 'Advance' },
    { label: 'True Beast', value: 'True Beast' }
  ];
  editLoading = false;
  editError = '';
  editSuccess = '';

  openResetDialog() {
    this.resetForm.reset();
    this.resetError = '';
    this.resetSuccess = '';
    this.resetAttempted = false;
    this.showResetDialog = true;
  }

  closeResetDialog() {
    this.showResetDialog = false;
  }

  submitReset() {
    this.resetAttempted = true;
    if (this.resetForm.invalid) return;
  
    this.resetLoading = true;
    this.resetError = '';
    this.resetSuccess = '';
    
    const { password, newPassword } = this.resetForm.value;
  
    this._authApiService.changePassword({ password, newPassword }).subscribe({
      next: (res) => {
        console.log('Password changed successfully:', res);
        localStorage.setItem('token', res.token);
        this.resetSuccess = 'Password changed successfully!';
        this.resetLoading = false;
        this.resetAttempted = false;
        this.showPasswordChangeSuccess = true;
  
        // ✅ تسجيل خروج إجباري لأن التوكن أصبح غير صالح
        setTimeout(() => {
          // localStorage.removeItem('token'); // نحذف التوكن الأول
          this._authApiService.Logout().subscribe({
            next: () => {
              localStorage.removeItem('token');
              this._router.navigate(['/auth/login']);
              
            },
            error: (err) => {
              // حتى لو فشل اللوج آوت، نوجّه المستخدم
              console.log('Logout failed:' , err);
            }
          });
          this.closeResetDialog();
          this.showPasswordChangeSuccess = false;
        }, 1500);
      },
      error: (err) => {
        this.resetError = err?.error?.message || 'Failed to reset password.';
        this.resetLoading = false;
      }
    });
  }
  


  toggleTheme() {
    this.themeVal = !this.themeVal;
    console.log(this.themeVal);
    this._themeManager.toggleTheme();
  }
  toggleLang() {
    this.langVal = !this.langVal;
    console.log(`Language Now is :  ${this.langVal}`);
    this._translateManager.toggleLanguage();
  }

  setLang(lang: 'en' | 'ar') {
    this.langVal = lang === 'ar';
    this._translateManager.changeLanguage(lang);
  }

  getUserPrefFromCookies() {
    const theme = this._themeManager.getCurrentTheme();
    const lang = this._translateManager.getCurrentLang();

    if (theme == 'dark') {
      this.themeVal = true;
    }

    if (lang == 'ar') {
      this.langVal = true;
    }
  }

  showLogoutDialog = false;

  openLogoutDialog() {
    this.showLogoutDialog = true;
  }
  closeLogoutDialog() {
    this.showLogoutDialog = false;
  }
  confirmLogout() {
    this.closeLogoutDialog();
    this._authApiService.Logout().subscribe({
      next: (res) => {
        console.log('Logout successful:', res);
        localStorage.removeItem('token');
        this._router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Logout failed:', err);
        // ممكن تعرض رسالة خطأ لو حبيت
      }
    });
  }
  
  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }
  toggleShowNewPassword() {
    this.showNewPassword = !this.showNewPassword;
  }

  UpdateUserProfile(data: UpdateUserProfileData) {
    this._authApiService.editProfile(data).subscribe({
      next: (res) => {
        console.log('UpdateUserProfile successful:', res);
      }
    });
  }

  ngOnInit() {
    this._themeManager.initTheme();
    this.getUserPrefFromCookies();
    this._authApiService.getProfileData().subscribe(data => {
      this.userProfile = {
        ...data.user,
        gender: (data.user.gender === 'male' || data.user.gender === 'female') ? data.user.gender : 'male'
      };
      this.editForm.patchValue({
        goal: data.user.goal,
        level: data.user.activityLevel,
        weight: data.user.weight
      });
    });
  }

  openEditPopup(field: 'goal' | 'level' | 'weight') {
    this.editField = field;
    if (this.userProfile) {
      this.editForm.patchValue({
        goal: this.userProfile.goal,
        level: this.userProfile.activityLevel,
        weight: this.userProfile.weight
      });
    }
    this.editError = '';
    this.editSuccess = '';
    this.showEditPopup = true;
  }

  closeEditPopup() {
    this.showEditPopup = false;
  }

  submitEdit() {
    if (!this.userProfile) return;
    this.editLoading = true;
    this.editError = '';
    this.editSuccess = '';
    const updated: UpdateUserProfileData = {
      goal: this.editForm.value.goal,
      activityLevel: this.editForm.value.level,
      weight: this.editForm.value.weight

    };
    this._authApiService.editProfile(updated).subscribe({
      next: (res) => {
        this.userProfile = {
          ...res.user,
          gender: (res.user.gender === 'male' || res.user.gender === 'female') ? res.user.gender : 'male'
        };
        this.editSuccess = 'Profile updated!';
        this.editLoading = false;
        setTimeout(() => this.closeEditPopup(), 1200);
      },
      error: (err) => {
        this.editError = err?.error?.message || 'Failed to update profile.';
        this.editLoading = false;
        console.log('Failed to update profile:', err);
      }
    });
  }


}
