import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Component, Inject, OnInit, OnDestroy, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, catchError, of, interval } from 'rxjs';
import { MealDetails, Meals, Category } from '../../../core/models/healthy-Interfaces';
import { HealthyServiceService } from '../../../core/services/healthey/healthy-service.service';
import { ThemeManagerService } from '../../../core/services/ThemeManger/ThemeManagerService.service';
import { tabData } from '../../../shared/components/custom-tab/tab.model';
import { TranslateManagerService } from '../../../core/services/TranslateManger/translate-manager-service.service';

@Component({
  selector: 'app-single-meal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './single-meal.component.html',
  styleUrls: ['./single-meal.component.scss']
})
export class SingleMealComponent implements OnInit, OnDestroy {
  mealDetails: MealDetails | null = null;
  mealsList: Meals[] = [];
  categories: Category[] = [];
  mealId: string | null = null;
  themeVal = false;
  langVal = false;
  isLoading = false;
  showSidebar = false;

  currentFilter: string = 'breakfast';
  filterTabs: tabData[] = [{ id: 'breakfast', title: 'Breakfast' }];

  private themeSubscription?: Subscription;
  private routeSubscription?: Subscription;

  constructor(
    private healthyService: HealthyServiceService,
    private themeManager: ThemeManagerService,
    private _translateManager: TranslateManagerService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.themeManager.initTheme();
    this.getUserPrefFromCookies();

    this.getCategories();

    this.routeSubscription = this.route.paramMap.subscribe(params => {
      this.mealId = params.get('id');
      if (this.mealId) {
        this.displayMealDetails(this.mealId);
      }
    });

    this.filterMealsByType('breakfast'); // تحميل الإفطار افتراضيًا
  }

  getUserPrefFromCookies(): void {
    const theme = this.themeManager.getCurrentTheme();
    const lang = this._translateManager.getCurrentLang();

    this.themeVal = theme === 'dark';
    this.langVal = lang === 'ar';
  }

  getCategories(): void {
    this.healthyService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.filterTabs = [
          { id: 'breakfast', title: 'Breakfast' },
          ...categories
            .filter(cat => cat.strCategory.toLowerCase() !== 'breakfast')
            .map(cat => ({ id: cat.strCategory, title: cat.strCategory }))
        ];
      }
    });
  }

  displayMealDetails(mealId: string): void {
    this.isLoading = true;
    this.healthyService.getMealDetails(mealId).pipe(
      catchError(() => of(null))
    ).subscribe({
      next: (response) => {
        this.mealDetails = response;
        this.isLoading = false;
      }
    });
  }

  filterMealsByType(filterType: string): void {
    this.isLoading = true;
    this.healthyService.getMealsByCategory(filterType).pipe(
      catchError(() => of([]))
    ).subscribe({
      next: (meals) => {
        this.mealsList = meals || [];
        this.isLoading = false;
      }
    });
  }

  changeFilter(filterId: string): void {
    this.currentFilter = filterId;
    this.filterMealsByType(filterId);
  }

  getIngredients(meal: MealDetails | null): { name: string; measure: string }[] {
    if (!meal) return [];
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = (meal as any)[`strIngredient${i}`];
      const measure = (meal as any)[`strMeasure${i}`];
      if (ingredient && ingredient.trim() !== '') {
        ingredients.push({ name: ingredient, measure: measure || '' });
      }
    }
    return ingredients;
  }

  ngOnDestroy(): void {
    this.themeSubscription?.unsubscribe();
    this.routeSubscription?.unsubscribe();
  }
}
