import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/auth-page.component').then((c) => c.AuthPageComponent),
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./pages/components/login/login.component').then(
            (c) => c.LoginComponent
          ),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./pages/components/Regester/Regester.component').then(
            (c) => c.RegisterComponent
          )
      },

      {
        path: 'forgot-password',
        loadComponent: () =>
          import(
            './pages/components/ForgetPass/forget-pass/forget-pass.component'
          ).then((c) => c.ForgetPassComponent),
      },
    

    ],
  },
];
