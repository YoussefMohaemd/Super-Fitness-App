import { Component } from '@angular/core';
import { MusclesGroup } from '../../../core/models/allMuscles';
import { MusclesService } from '../../../core/services/muscles/muscles.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ThemeManagerService } from '../../../core/services/ThemeManger/ThemeManagerService.service';
import { tabData } from '../../../shared/components/custom-tab/tab.model';
import { CarouselModule } from 'primeng/carousel';
import { TranslateModule } from '@ngx-translate/core';
import { CustomSliderComponent } from '../../../shared/components/custom-slider/custom-slider.component';

@Component({
  selector: 'app-fitness-class',
  imports: [
    CommonModule,
    CarouselModule,
    CustomSliderComponent,
    TranslateModule,
  ],
  standalone: true,
  templateUrl: './fitness-class.component.html',
  styleUrls: ['./fitness-class.component.scss'],
})
export class FitnessClassComponent {
  muscleGroups: MusclesGroup[] = [];
  displayedMuscleGroups: MusclesGroup[] = [];
  selectedGroupId = 'full_body';
  themeVal = false;
  filterTabs: tabData[] = [];

  tabResponsiveOptions = [
    { breakpoint: '1400px', numVisible: 6, numScroll: 3 },
    { breakpoint: '1200px', numVisible: 5, numScroll: 3 },
    { breakpoint: '992px', numVisible: 4, numScroll: 2 },
    { breakpoint: '768px', numVisible: 3, numScroll: 2 },
    { breakpoint: '576px', numVisible: 2, numScroll: 1 },
    { breakpoint: '420px', numVisible: 1, numScroll: 1 },
  ];

  // Map displayed muscle groups to slider items shape
  get muscleSliderItems() {
    return this.displayedMuscleGroups.map((g) => ({
      idMeal: g._id,
      strMeal: g.name,
      strMealThumb: this.getMuscleGroupImage(g._id),
    }));
  }

  constructor(
    private _MusclesService: MusclesService,
    private router: Router,
    private themeService: ThemeManagerService
  ) {}

  ngOnInit() {
    this._MusclesService.getAllmuscles().subscribe((response) => {
      this.muscleGroups = response.musclesGroup;
      this.generateFilterTabs();
      this.updateDisplayedMuscleGroups();
    });

    this.themeVal = this.themeService.getCurrentTheme() === 'dark';
  }

  shouldShow(group: MusclesGroup): boolean {
    return (
      this.selectedGroupId === 'full_body' || this.selectedGroupId === group._id
    );
  }

  updateDisplayedMuscleGroups() {
    this.displayedMuscleGroups = this.muscleGroups.filter((group) =>
      this.shouldShow(group)
    );
  }

  generateFilterTabs() {
    this.filterTabs = [
      { id: 'full_body', title: 'fitnessClass.full_body' },
      ...this.muscleGroups.map((group) => ({
        id: group._id,
        title: group.name,
      })),
    ];
  }

  onFilterChange(selectedId: string) {
    this.selectedGroupId = selectedId;
    this.updateDisplayedMuscleGroups();
  }

  onReadMore(id?: string) {
    if (id) {
      this.router.navigate(['/class', id]);
    }
  }

  getMuscleGroupImage(muscleGroupId: string): string {
    return 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop';
  }
}
