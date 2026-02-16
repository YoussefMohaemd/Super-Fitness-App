import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../../services/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private _AuthService: AuthService) {}

  canActivate(): boolean | UrlTree {
    const token = this._AuthService.getToken();
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
  
        return true; // ✅ نسمح بالدخول لأن التوكن موجود وصالح
      } catch (err) {
        console.warn('Invalid token:', err);
      }
    }
    return this.router.createUrlTree(['/auth/login']);
  }
}
