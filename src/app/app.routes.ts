import { Routes } from '@angular/router';

import { MainLayout } from '@layout/main-layout/main-layout';
import { RouteMeta } from '@shared/models/route-meta.model';
import { ROUTES } from '@shared/utils/app.constants';

/**
 * Every public page is a child of `MainLayout`, so the navbar and footer are
 * instantiated once and survive navigation rather than being rebuilt per page.
 *
 * Features are code-split at this boundary via `loadChildren`. `MainLayout`
 * itself is imported eagerly — it is part of the first paint, so lazy-loading
 * it would only add a round trip.
 *
 * Route paths come from `ROUTES` in `app.constants.ts`; use that same constant
 * for `routerLink` targets so a path is never spelled out twice.
 */
export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      // Order matters. A `path: ''` route matches on *prefix*, so it would also
      // match `/about` and pull down the home chunk before backtracking. Keeping
      // the empty path after its siblings makes each URL hit exactly one chunk.
      {
        path: ROUTES.about,
        loadChildren: () => import('@features/about/about.routes').then((m) => m.ABOUT_ROUTES),
      },
      {
        path: ROUTES.products,
        loadChildren: () =>
          import('@features/product/product.routes').then((m) => m.PRODUCT_ROUTES),
      },
      {
        path: ROUTES.distributors,
        loadChildren: () =>
          import('@features/distributors/distributors.routes').then((m) => m.DISTRIBUTOR_ROUTES),
      },
      {
        path: ROUTES.becomeDistributor,
        loadChildren: () =>
          import('@features/distributors/distributors.routes').then(
            (m) => m.BECOME_DISTRIBUTOR_ROUTES,
          ),
      },
      {
        path: ROUTES.contact,
        loadChildren: () =>
          import('@features/contact/contact.routes').then((m) => m.CONTACT_ROUTES),
      },
      {
        path: ROUTES.home,
        loadChildren: () => import('@features/home/home.routes').then((m) => m.HOME_ROUTES),
      },
      {
        path: '**',
        loadComponent: () => import('@features/not-found/not-found').then((m) => m.NotFound),
        title: 'Page not found',
        data: {
          meta: {
            description: 'The page you were looking for could not be found.',
            robots: 'noindex, follow',
          } satisfies RouteMeta,
        },
      },
    ],
  },
];
