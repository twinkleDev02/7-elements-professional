import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import {
  PreloadAllModules,
  TitleStrategy,
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
  withPreloading,
  withViewTransitions,
} from '@angular/router';

import { routes } from './app.routes';
import { apiInterceptor } from '@core/interceptors/api.interceptor';
import { errorInterceptor } from '@core/interceptors/error.interceptor';
import { loadingInterceptor } from '@core/interceptors/loading.interceptor';
import { SeoService } from '@core/services/seo.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),

    provideRouter(
      routes,
      // Route params and `data` flow straight into `input()` signals.
      withComponentInputBinding(),
      // Native cross-fade between pages where the browser supports it.
      withViewTransitions(),
      // Restore scroll on back/forward; honour #fragment links.
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
      }),
      // Four small marketing pages: fetch them all once the shell is idle so
      // navigation is instant. Swap for a selective strategy if the app grows.
      withPreloading(PreloadAllModules),
    ),

    provideHttpClient(
      withFetch(),
      // Order matters: `apiInterceptor` rewrites the URL before anything else
      // reads it, and `errorInterceptor` must be last so it wraps the whole chain.
      withInterceptors([apiInterceptor, loadingInterceptor, errorInterceptor]),
    ),

    // Runs on every successful navigation — no component has to remember to
    // set its own title or meta tags.
    { provide: TitleStrategy, useExisting: SeoService },
  ],
};
