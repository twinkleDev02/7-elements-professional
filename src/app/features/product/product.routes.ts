import { Routes } from '@angular/router';

import { RouteMeta } from '@shared/models/route-meta.model';

import { ProductCollection } from './product-collection';

export const PRODUCT_ROUTES: Routes = [
  {
    path: '',
    component: ProductCollection,
    title: 'The Collection',
    data: {
      meta: {
        description:
          'Shampoos, masks, serums and treatments formulated for salon professionals ' +
          'and finished for home use.',
      } satisfies RouteMeta,
    },
  },

  {
    // `withComponentInputBinding()` is enabled in app.config.ts, so the
    // component's `slug = input.required<string>()` receives this param with no
    // ActivatedRoute plumbing.
    path: ':slug',
    loadComponent: () => import('./product-detail').then((m) => m.ProductDetail),
    data: {
      meta: {
        description:
          'Salon-grade professional hair care from 7 Elements Professional — ' +
          'sulfate, paraben and silicone free.',
        type: 'product',
      } satisfies RouteMeta,
    },
  },
];
