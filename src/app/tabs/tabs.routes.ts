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
        path: 'wallets',
        loadComponent: () =>
          import('../pages/wallets/wallets.page').then((m) => m.WalletsPage),
        canActivate: [authGuard],
      },
      {
        path: 'transactions',
        loadComponent: () =>
          import('../pages/transactions/transactions.page').then((m) => m.TransactionsPage),
        canActivate: [authGuard],
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('../pages/profile/profile.page').then((m) => m.ProfilePage),
        canActivate: [authGuard],
      },
      {
        path: '',
        redirectTo: '/tabs/wallets',
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
    redirectTo: '/tabs/wallets',
    pathMatch: 'full',
  },
];
