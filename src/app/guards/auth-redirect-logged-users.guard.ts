import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authRedirectLoggedUsersGuard: CanActivateFn = (route, state) => {
  const AuthSvc = inject(AuthService);
  const router = inject(Router);
  
  if (AuthSvc.isAuthenticated()) {
    router.navigate(['/tabs/home']);
    return false;
  }
  return true;
};
