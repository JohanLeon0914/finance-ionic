import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { authGuard } from '../guards/auth.guard';
import { authRedirectLoggedUsersGuard } from '../guards/auth-redirect-logged-users.guard';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('../pages/home/home.page').then((m) => m.HomePage),
        canActivate: [authGuard],
      },
      {
        path: 'tab2',
        loadComponent: () =>
          import('../pages/tab2/tab2.page').then((m) => m.Tab2Page),
        canActivate: [authGuard],
      },
      {
        path: 'tab3',
        loadComponent: () =>
          import('../pages/tab3/tab3.page').then((m) => m.Tab3Page),
        canActivate: [authGuard],
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'signin',
    loadComponent: () =>
      import('../pages/sign-in/sign-in.component').then((m) => m.SignInComponent),
    canActivate: [authRedirectLoggedUsersGuard],
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('../pages/sign-up/sign-up.component').then((m) => m.SignUpComponent),
    canActivate: [authRedirectLoggedUsersGuard],
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full',
  },
];
