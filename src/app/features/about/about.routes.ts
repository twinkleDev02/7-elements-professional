import { Routes } from '@angular/router';

import { RouteMeta } from '@shared/models/route-meta.model';

import { About } from './about';

export const ABOUT_ROUTES: Routes = [
  {
    path: '',
    component: About,
    title: 'Our Story',
    data: {
      meta: {
        description:
          'The seven elements behind every formula — our philosophy, our lab, and the ' +
          'salon professionals we make haircare for.',
      } satisfies RouteMeta,
    },
  },
];
