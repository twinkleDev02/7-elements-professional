import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { StorageService } from '@core/services/storage.service';
import { STORAGE_PREFIX } from '@shared/utils/app.constants';

const SESSION_KEY = `${STORAGE_PREFIX}:session`;

/**
 * Gate for authenticated areas — the salon-partner and wholesale portals that
 * sit behind sign-in.
 *
 * TODO: replace the token check with the real `AuthService` once the auth
 * backend is chosen. The public marketing routes do not use this guard.
 */
export const authGuard: CanActivateFn = (_route, state) => {
  const storage = inject(StorageService);
  const router = inject(Router);

  const token = storage.get<string | null>(SESSION_KEY, null);

  if (token) {
    return true;
  }

  // Keep the attempted URL so sign-in can send the visitor back afterwards.
  return router.createUrlTree(['/'], { queryParams: { returnUrl: state.url } });
};
