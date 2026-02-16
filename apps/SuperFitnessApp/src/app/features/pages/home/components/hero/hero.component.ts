import { Component, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HorizonbarComponent } from 'apps/SuperFitnessApp/src/app/features/pages/home/components/horizonbar/horizonbar.component';
import { ThemeManagerService } from 'apps/SuperFitnessApp/src/app/core/services/ThemeManger/ThemeManagerService.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, HorizonbarComponent, TranslateModule],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss'],
})
export class HeroComponent implements OnInit {
  // نستخدم computed عشان دايمًا يحدث القيمة مع تغيّر الثيم
  themeVal = computed(() => this.themeService.getCurrentTheme() === 'dark');

  constructor(private themeService: ThemeManagerService) {}

  ngOnInit() {
    // تهيئة الثيم من الكوكيز عند البداية
    this.themeService.initTheme().subscribe((theme) => {
      // تحديث فوري بعد قراءة الكوكيز
      // هنا مش محتاج تعمل set بنفسك لأن computed هيعيد الحساب تلقائي
    });
  }

  // دالة للتبديل (لو استخدمتها في زر)
  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
