import { HttpContextToken, HttpInterceptorFn } from '@angular/common/http';

import { environment } from '@env/environment';

/**
 * Set on a request to keep its URL exactly as written — for CDN assets, third
 * party endpoints, or anything that must not be routed through the API host.
 *
 * ```ts
 * http.get(url, { context: new HttpContext().set(SKIP_API_PREFIX, true) });
 * ```
 */
export const SKIP_API_PREFIX = new HttpContextToken<boolean>(() => false);

/**
 * Prefixes relative URLs with `environment.apiUrl` and applies the default
 * headers, so call sites only ever write `'products'` rather than a full URL.
 */
export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const isAbsolute = /^https?:\/\//i.test(req.url);

  if (isAbsolute || req.context.get(SKIP_API_PREFIX)) {
    return next(req);
  }

  const base = environment.apiUrl.replace(/\/$/, '');
  const path = req.url.replace(/^\//, '');

  return next(
    req.clone({
      url: `${base}/${path}`,
      setHeaders: { Accept: 'application/json' },
    }),
  );
};
