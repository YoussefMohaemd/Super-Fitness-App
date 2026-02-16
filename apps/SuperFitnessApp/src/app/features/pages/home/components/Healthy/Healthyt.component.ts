import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Category, MealDetails, Meals } from 'apps/SuperFitnessApp/src/app/core/models/healthy-Interfaces';
import { interval, Subscription } from 'rxjs';
import { HealthyServiceService } from 'apps/SuperFitnessApp/src/app/core/services/healthey/healthy-service.service';
import { ThemeManagerService } from 'apps/SuperFitnessApp/src/app/core/services/ThemeManger/ThemeManagerService.service';
import { TranslateManagerService } from 'apps/SuperFitnessApp/src/app/core/services/TranslateManger/translate-manager-service.service';
import {  Router } from '@angular/router';
import { CustomSliderComponent } from "apps/SuperFitnessApp/src/app/shared/components/custom-slider/custom-slider.component";
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-healthyt',
  imports: [CommonModule, CustomSliderComponent, TranslateModule ],
  templateUrl: './Healthyt.component.html',
  styleUrl: './Healthyt.component.scss',
})
export class HealthytComponent implements OnInit , OnDestroy {

  categories: Category[] = [];
  displayedMeals: Meals[] = [];
  selectedMealDetails: MealDetails | null = null;
  themeVal: boolean = false;
  langVal: boolean = false;
  isLoading: boolean = false; // 🔹 New loading state
  private themeSubscription?: Subscription;
  private mealsSubscription?: Subscription;

 

  constructor(
    private healthyService: HealthyServiceService,
    private themeManager: ThemeManagerService,
    private _translateManager: TranslateManagerService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  

  getMealDetails(mealId: string): void {
    this.healthyService.getMealDetails(mealId).subscribe({
      next: (meal) => {
        this.selectedMealDetails = meal;
        this.router.navigate(['/single-meal',mealId]   );
      } 
    });
  }

  getUserPrefFromCookies(): void {
    const theme = this.themeManager.getCurrentTheme();
    const lang = this._translateManager.getCurrentLang();
    this.themeVal = theme === 'dark';
    this.langVal = lang === 'ar';
  }

  filterMealsByType(filterType: string): void {
    this.isLoading = true; // 🔹 Start loading
    this.healthyService.getMealsByCategory(filterType).subscribe({
      next: (meals) => {
        this.displayedMeals = meals;
        this.isLoading = false; // 🔹 Stop loading
      },
      error: () => {
        this.isLoading = false; // 🔹 Stop loading on error
      }
    });
  }

  onFilterChange(filterId: string): void {
    this.filterMealsByType(filterId);
  }

  ngOnInit(): void {
    this.themeManager.initTheme();
    this.getUserPrefFromCookies();
    this.filterMealsByType('breakfast'); // Load breakfast by default

    if (isPlatformBrowser(this.platformId)) {
      this.themeSubscription = interval(1000).subscribe(() => {
        const currentTheme = this.themeManager.getCurrentTheme();
        this.themeVal = currentTheme === 'dark';
      });
    }
  }

  ngOnDestroy(): void {
    this.themeSubscription?.unsubscribe();
    this.mealsSubscription?.unsubscribe();
  }
}