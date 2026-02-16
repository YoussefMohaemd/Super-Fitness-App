import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MusclesService } from '../../../core/services/muscles/muscles.service';
import {
  MuscleGroupDetail,
  MusclesGroup,
} from '../../../core/models/allMuscles';
import { FormsModule } from '@angular/forms';
import { CustomSliderComponent } from '../../../shared/components/custom-slider/custom-slider.component';
import { CarouselModule } from 'primeng/carousel';
import { tabData } from '../../../shared/components/custom-tab/tab.model';
import { Exercise, ExerciseGroup } from '../../../core/models/Exercise';
import { ExerciseService } from '../../../core/services/Exercise/exercise.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ThemeManagerService } from '../../../core/services/ThemeManger/ThemeManagerService.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-single-class',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CustomSliderComponent,
    CarouselModule,
    TranslateModule,
  ],
  templateUrl: './single-class.component.html',
  styleUrls: ['./single-class.component.scss'],
})
export class SingleClassComponent implements OnInit {
  muscleGroupDetail: MuscleGroupDetail | null = null;
  exercises: ExerciseGroup[] = [];
  selectedExercise: ExerciseGroup | null = null;
  selectedDifficulty: string = '67c797e226895f87ce0aa94b'; // Beginner by default
  loading = true;
  error = '';
  themeVal = false;
  musclesLoading = true;

  // video state
  isPlaying = false;
  embedUrl: SafeResourceUrl | null = null;

  // Optional notice when a difficulty has no data
  notice = '';

  // Tabs (muscle groups) for header carousel
  muscleGroups: MusclesGroup[] = [];
  filterTabs: tabData[] = [];
  selectedGroupId = '';
  tabResponsiveOptions = [
    { breakpoint: '1400px', numVisible: 6, numScroll: 3 },
    { breakpoint: '1200px', numVisible: 5, numScroll: 3 },
    { breakpoint: '992px', numVisible: 4, numScroll: 2 },
    { breakpoint: '768px', numVisible: 3, numScroll: 2 },
    { breakpoint: '576px', numVisible: 2, numScroll: 1 },
    { breakpoint: '420px', numVisible: 1, numScroll: 1 },
  ];

  // Known difficulty IDs
  private readonly beginnerId = '67c797e226895f87ce0aa94b';
  private readonly intermediateId = '67c797e226895f87ce0aa94c';
  private readonly advancedId = '67c797e226895f87ce0aa94d';

  difficultyLevels = [
    { id: this.beginnerId, name: 'singleClass.difficulty_beginner' },
    { id: this.intermediateId, name: 'singleClass.difficulty_intermediate' },
    { id: this.advancedId, name: 'singleClass.difficulty_advanced' },
  ];

  // Map exercises for recommendation slider (reuse custom slider API)
  get recommendationItems() {
    return this.exercises.map((e) => ({
      idMeal: e._id,
      strMeal: e.exercise,
      strMealThumb: this.getVideoThumbnail(e.short_youtube_demonstration_link),
    }));
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private musclesService: MusclesService,
    private exerciseService: ExerciseService,
    private themeService: ThemeManagerService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    const groupId = this.route.snapshot.paramMap.get('id');
    if (groupId) {
      this.selectedGroupId = groupId;
      this.loadMuscleGroupDetail(groupId);
      this.loadExercises(groupId);
    }

    // Load all muscle groups for the header tabs
    this.musclesLoading = true;
    this.musclesService.getAllmuscles().subscribe({
      next: (res) => {
        this.muscleGroups = res?.musclesGroup || [];
        this.generateFilterTabs();
        this.musclesLoading = false;
      },
      error: (err) => {
        console.error('Error loading muscle groups:', err);
        this.musclesLoading = false;
      },
    });

    this.themeVal = this.themeService.getCurrentTheme() === 'dark';
  }

  private generateFilterTabs() {
    this.filterTabs = [
      { id: 'full_body', title: 'fitnessClass.full_body' },
      ...this.muscleGroups.map((g) => ({ id: g._id, title: g.name })),
    ];
  }

  onFilterChange(groupId: string) {
    // Highlight immediately and refresh data to first exercise of this group
    this.selectedGroupId = groupId;

    if (groupId === 'full_body') {
      this.router.navigate(['/classes']);
      return;
    }

    if (groupId) {
      // Reset difficulty to Beginner and clear current selection
      this.selectedDifficulty = this.beginnerId;
      this.selectedExercise = null;
      this.isPlaying = false;
      this.embedUrl = null;
      this.loadMuscleGroupDetail(groupId);
      this.loadExercises(groupId);
    }
  }

  loadMuscleGroupDetail(groupId: string) {
    this.loading = true;
    this.musclesService.getMuscleGroupDetail(groupId).subscribe({
      next: (response) => {
        this.muscleGroupDetail = response.muscleGroup;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'singleClass.error_group_details';
        this.loading = false;
        console.error('Error loading muscle group detail:', error);
      },
    });
  }

  private setExercisesAndSelectFirst(list: ExerciseGroup[] | null) {
    this.exercises = list ?? [];
    this.selectedExercise =
      this.exercises.length > 0 ? this.exercises[0] : null;
    this.isPlaying = false;
    this.embedUrl = null;
  }

  loadExercises(groupId: string) {
    this.notice = '';
    this.exerciseService
      .getRandomExercises(groupId, this.selectedDifficulty, 10)
      .subscribe({
        next: (response: Exercise) => {
          const exercises = response?.exercises ?? [];

          if (
            exercises.length === 0 &&
            this.selectedDifficulty !== this.beginnerId
          ) {
            // Fallback to Beginner if Intermediate/Advanced have no data
            this.notice = 'singleClass.no_exercises_difficulty_fallback';
            this.exerciseService
              .getRandomExercises(groupId, this.beginnerId, 10)
              .subscribe({
                next: (fallback) => {
                  const fallbackExercises = fallback?.exercises ?? [];
                  if (fallbackExercises.length === 0) {
                    this.notice = 'singleClass.no_exercises_available';
                    this.setExercisesAndSelectFirst([]);
                  } else {
                    this.setExercisesAndSelectFirst(fallbackExercises);
                  }
                },
                error: (err) => {
                  console.error('Error loading fallback exercises:', err);
                  this.notice = 'singleClass.error_fallback_exercises';
                  this.setExercisesAndSelectFirst([]);
                },
              });
            return;
          }

          // Normal case (response has data or we're already on beginner)
          if (exercises.length === 0) {
            this.notice = 'singleClass.no_exercises_available';
          } else {
            this.notice = '';
          }
          this.setExercisesAndSelectFirst(exercises);
        },
        error: (error) => {
          console.error('Error loading exercises:', error);
          this.notice = 'singleClass.error_load_exercises';
          this.setExercisesAndSelectFirst([]);
        },
      });
  }

  onDifficultyChange() {
    const groupId =
      this.selectedGroupId || this.route.snapshot.paramMap.get('id') || '';
    if (groupId) {
      // Clear current selection so the first result becomes active and reset player
      this.selectedExercise = null;
      this.isPlaying = false;
      this.embedUrl = null;
      this.loadExercises(groupId);
    }
  }

  goBack() {
    this.router.navigate(['/classes']);
  }

  playVideo(videoUrl: string) {
    if (videoUrl) {
      // open safely to avoid window.opener attacks
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        try {
          newWindow.opener = null;
        } catch (e) {
          // ignore if environment prevents setting opener
        }
        newWindow.location.href = videoUrl;
      }
    }
  }

  playSelected() {
    if (!this.selectedExercise) return;
    const url = this.selectedExercise.short_youtube_demonstration_link;
    const embed = this.buildEmbedUrl(url, true);
    if (embed) {
      this.embedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embed);
      this.isPlaying = true;
    } else {
      this.notice = 'singleClass.error_play_selected';
    }
  }

  private buildEmbedUrl(videoUrl: string, autoplay = false): string {
    const id = this.extractYouTubeVideoId(videoUrl);
    const auto = autoplay ? '1' : '0';
    return id
      ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=${auto}&rel=0&modestbranding=1`
      : '';
  }

  selectExercise(exercise: ExerciseGroup) {
    this.selectedExercise = exercise;
    this.isPlaying = false;
    this.embedUrl = null;
  }

  onRecommendationSelect(exerciseId: string) {
    const ex = this.exercises.find((e) => e._id === exerciseId);
    if (ex && ex.short_youtube_demonstration_link) {
      this.playVideo(ex.short_youtube_demonstration_link);
    }
  }

  getVideoThumbnail(videoUrl: string): string {
    const videoId = this.extractYouTubeVideoId(videoUrl);
    return videoId
      ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
      : '/auth-bg.jpg';
  }

  onThumbnailError(event: Event) {
    const img = event.target as HTMLImageElement | null;
    if (!img) return;
    // Final fallback image to avoid broken thumbnails
    img.src = '/auth-bg.jpg';
  }

  private extractYouTubeVideoId(url?: string | null): string | null {
    if (!url) return null;
    try {
      const u = new URL(url);
      // youtu.be short links
      if (u.hostname.includes('youtu.be')) return u.pathname.replace('/', '');
      // standard watch?v= links
      const v = u.searchParams.get('v');
      if (v) return v;
      // /embed/{id}
      const parts = u.pathname.split('/').filter(Boolean);
      const embedIdx = parts.indexOf('embed');
      if (embedIdx !== -1 && parts[embedIdx + 1]) return parts[embedIdx + 1];
    } catch (e) {
      // fallback to regex if URL constructor fails
      const regExp =
        /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([A-Za-z0-9_-]{11})/;
      const match = url.match(regExp);
      if (match && match[1]) return match[1];
    }
    return null;
  }
}
