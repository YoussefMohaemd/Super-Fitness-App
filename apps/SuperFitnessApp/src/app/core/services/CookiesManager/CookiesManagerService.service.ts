import { inject, Injectable } from '@angular/core';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { CookiesCustomOptions } from '../../models/cookiesInterface'; 

@Injectable({
  providedIn: 'root',
})
export class CookiesManagerService {
  private readonly cookies = inject(SsrCookieService);

  setCookie(key: string, value: string, options?: CookiesCustomOptions): void {
    let expiresVal: Date | number | undefined;
    if (options?.expireNum !== undefined) {
      expiresVal = options.expireNum;
    } else if (options?.expireDate) {
      expiresVal = options.expireDate;
    }
    this.cookies.set(key, value, expiresVal);
  }

  getCookie(name: string): string {
    return this.cookies.get(name);
  }

  deleteCookie(name: string): void {
    this.cookies.delete(name);
  }
}