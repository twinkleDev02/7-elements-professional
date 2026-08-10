import { Routes } from '@angular/router';

import { pendingChangesGuard } from '@core/guards/pending-changes.guard';
import { RouteMeta } from '@shared/models/route-meta.model';

import { FindDistributor } from './find-distributor';

export const DISTRIBUTOR_ROUTES: Routes = [
  {
    path: '',
    component: FindDistributor,
    title: 'Distributor Network',
    data: {
      meta: {
        description:
          'Find an authorised 7 Elements Professional distributor near you — salon-grade ' +
          'hair care supplied across India.',
      } satisfies RouteMeta,
    },
  },
];

/**
 * Registered at the top level rather than under `/distributors`, because the
 * reference gives it its own URL. Kept in this file so the whole feature's
 * routing is described in one place.
 */
export const BECOME_DISTRIBUTOR_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./become-distributor').then((m) => m.BecomeDistributor),
    title: 'Become A Distributor',
    // A half-filled application is worth warning about before it is lost.
    canDeactivate: [pendingChangesGuard],
    data: {
      meta: {
        description:
          'Partner with 7 Elements Professional — attractive margins, exclusive territory ' +
          'and full marketing and training support.',
      } satisfies RouteMeta,
    },
  },
];
