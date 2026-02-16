import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { HealthyServiceService } from '../../../core/services/healthey/healthy-service.service';
import { CommonModule } from '@angular/common';
import {
  Meals,
  MealDetails,
  Category,
} from '../../../core/models/healthy-Interfaces';
import { ThemeManagerService } from '../../../core/services/ThemeManger/ThemeManagerService.service';
import { CustomTabComponent } from '../../../shared/components/custom-tab/custom-tab.component';
import { CustomSliderComponent } from '../../../shared/components/custom-slider/custom-slider.component';
import { Subscription, interval } from 'rxjs';
import { tabData } from '../../../shared/components/custom-tab/tab.model';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateManagerService } from '../../../core/services/TranslateManger/translate-manager-service.service';

@Component({
  selector: 'app-healthy-nutri',
  standalone: true,
  imports: [
    CommonModule,
    CustomTabComponent,
    CustomSliderComponent,
    TranslateModule,
  ],
  templateUrl: './healthy-nutri.component.html',
  styleUrl: './healthy-nutri.component.scss',
})
export class HealthyNutriComponent implements OnInit, OnDestroy {
  categories: Category[] = [];
  displayedMeals: Meals[] = [];
  selectedMealDetails: MealDetails | null = null;
  themeVal: boolean = false;
  langVal: boolean = false;
  isLoading: boolean = false; // 🔹 New loading state
  private themeSubscription?: Subscription;
  private mealsSubscription?: Subscription;

  // Tabs will be built dynamically from API
  filterTabs: tabData[] = [{ id: 'breakfast', title: 'Breakfast' }];

  constructor(
    private healthyService: HealthyServiceService,
    private themeManager: ThemeManagerService,
    private _translateManager: TranslateManagerService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  getCategories(): void {
    this.healthyService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.filterTabs = [
          { id: 'breakfast', title: 'Breakfast' },
          ...categories
            .filter((cat) => cat.strCategory.toLowerCase() !== 'breakfast')
            .map((cat) => ({ id: cat.strCategory, title: cat.strCategory })),
        ];
      },
    });
  }

  getMealDetails(mealId: string): void {
    this.healthyService.getMealDetails(mealId).subscribe({
      next: (meal) => {
        this.selectedMealDetails = meal;
        this.router.navigate(['/single-meal', mealId]);
      },
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
      },
    });
  }

  onFilterChange(filterId: string): void {
    this.filterMealsByType(filterId);
  }

  ngOnInit(): void {
    this.themeManager.initTheme();
    this.getUserPrefFromCookies();
    this.getCategories();
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
