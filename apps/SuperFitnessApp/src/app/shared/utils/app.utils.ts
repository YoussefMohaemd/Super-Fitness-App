import { inject } from '@angular/core';
import { ThemeManagerService } from '../../core/services/ThemeManger/ThemeManagerService.service';
import { TranslateManagerService } from '../../core/services/TranslateManger/translate-manager-service.service';
import { forkJoin } from 'rxjs';

export const appInit = () => {
  const themeManager = inject(ThemeManagerService);
  const translateManager = inject(TranslateManagerService);
  return forkJoin([themeManager.initTheme(), translateManager.initTranslate()]);
};
