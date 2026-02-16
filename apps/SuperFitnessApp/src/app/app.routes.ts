import { UserProfileComponent } from './features/pages/user-profile/user-profile.component';
import { Routes } from '@angular/router';
import { AUTH_ROUTES } from './core/auth/auth.routes';
import { AuthGuard } from './core/auth/guards/auth.guard';

export const appRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'auth',
    children: AUTH_ROUTES, 
  }, {
    path: 'home',
    loadComponent: () =>
      import('./features/pages/home/home.component').then(
        (c) => c.HomeComponent
      ),
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./features/pages/about-us/about-us.component').then(
        (c) => c.AboutUsComponent
      ),
  },
  {
    path: 'classes',
    loadComponent: () =>
      import('./features/pages/fitness-class/fitness-class.component').then(
        (c) => c.FitnessClassComponent
      ),
  },
  {
    path: 'class/:id',
    loadComponent: () =>
      import('./features/pages/single-class/single-class.component').then(
        (c) => c.SingleClassComponent
      ),
  },
  {
    path:'user-profile',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./features/pages/user-profile/user-profile.component').then((c) => c.UserProfileComponent),
  },
  {
    path: 'healthy',
    loadComponent: () =>
      import('./features/pages/healthy-nutri/healthy-nutri.component').then(
        (c) => c.HealthyNutriComponent
      ),
  },
  {
    path: 'single-meal/:id',
    loadComponent: () =>
      import('./features/pages/single-meal/single-meal.component').then(
        (c) => c.SingleMealComponent
      ),
  },


];
