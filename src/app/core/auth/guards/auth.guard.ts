import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthApi } from '../data-access/auth.api';

export const authGuard: CanActivateFn = async (_route, state) => {
  const authApi = inject(AuthApi);
  const router = inject(Router);

  try {
    const session = await authApi.getSession();
    return session ? true : router.createUrlTree(['/login'], {
      queryParams: { returnUrl: state.url },
    });
  } catch {
    return router.createUrlTree(['/login'], {
      queryParams: { returnUrl: state.url },
    });
  }
};
