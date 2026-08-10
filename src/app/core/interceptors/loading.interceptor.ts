import { HttpContextToken, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';

import { LoaderService } from '@core/services/loader.service';

/**
 * Set on a request to keep it out of the global loading indicator — useful for
 * polling, prefetching and type-ahead lookups that should stay invisible.
 */
export const SKIP_LOADER = new HttpContextToken<boolean>(() => false);

/** Drives the global progress indicator from in-flight request count. */
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.context.get(SKIP_LOADER)) {
    return next(req);
  }

  const loader = inject(LoaderService);
  loader.start();

  return next(req).pipe(finalize(() => loader.stop()));
};
