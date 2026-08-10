import { Routes } from '@angular/router';

import { RouteMeta } from '@shared/models/route-meta.model';

import { Home } from './home';

/**
 * Lazily loaded by `app.routes.ts`. The component is imported directly rather
 * than through a second `loadComponent`, so the whole feature ships as one
 * chunk instead of two round trips.
 */
export const HOME_ROUTES: Routes = [
  {
    path: '',
    component: Home,
    title: 'Luxury Professional Haircare',
    data: {
      meta: {
        description:
          'Salon-grade haircare crafted from seven elemental actives. Discover the ' +
          '7 Elements Professional collection.',
      } satisfies RouteMeta,
    },
  },
];
