import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthApi } from '../data-access/auth.api';

export const guestGuard: CanActivateFn = async () => {
  const authApi = inject(AuthApi);
  const router = inject(Router);

  try {
    return (await authApi.getSession())
      ? router.createUrlTree(['/dashboard'])
      : true;
  } catch {
    return true;
  }
};
