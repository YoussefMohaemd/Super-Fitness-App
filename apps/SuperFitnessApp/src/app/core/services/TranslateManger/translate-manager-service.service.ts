import { DOCUMENT } from '@angular/common';
import { inject, Injectable, signal } from '@angular/core';
import { CookiesManagerService } from '../CookiesManager/CookiesManagerService.service';
import { Lang } from '../../types/lang.type';
import { TranslateService } from '@ngx-translate/core';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TranslateManagerService {
  private readonly langKey = 'lang';
  private readonly root = inject(DOCUMENT);
  private readonly cookiesManager = inject(CookiesManagerService);
  private currentLang = signal<Lang>('en');
  private readonly translateService = inject(TranslateService);

  initTranslate() {
    this.translateService.addLangs(['ar', 'en']);
    this.translateService.setDefaultLang('en');
  
    let lang = (this.cookiesManager.getCookie(this.langKey) as string) || 'en';
  
    this.setHTMLLang(lang as Lang);
    this.setCurrentLang(lang as Lang);
  
  
    return this.translateService.use(lang).pipe(
      tap(() => {
      
      })
    );
  }
  

  toggleLanguage(): void {
    let currentLang = this.cookiesManager.getCookie(this.langKey);
    let newLang: Lang = currentLang == '' || currentLang == 'en' ? 'ar' : 'en';
    this.changeLanguage(newLang);
  }

  getCurrentLang(): Lang {
    return this.currentLang();
  }

  setCurrentLang(lang: Lang): void {
    this.currentLang.set(lang);
  }

  setHTMLLang(lang: Lang): void {
    if (lang == 'ar') {
      this.root.documentElement.lang = 'ar';
      this.root.documentElement.dir = 'rtl';
    } else {
      this.root.documentElement.lang = 'en';
      this.root.documentElement.dir = 'ltr';
    }
  }

  changeLanguage(lang: Lang): void {
    this.translateService.setDefaultLang(lang);
    this.translateService.use(lang);
    this.setCurrentLang(lang);
    this.setHTMLLang(lang);
    this.cookiesManager.setCookie(this.langKey, lang, {
      expireNum: 400,
    });
  }
}