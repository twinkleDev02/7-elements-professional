import { Routes } from '@angular/router';

import { pendingChangesGuard } from '@core/guards/pending-changes.guard';
import { RouteMeta } from '@shared/models/route-meta.model';

import { Contact } from './contact';

export const CONTACT_ROUTES: Routes = [
  {
    path: '',
    component: Contact,
    title: 'Contact',
    canDeactivate: [pendingChangesGuard],
    data: {
      meta: {
        description:
          'Salon partnerships, wholesale enquiries and product support — get in touch ' +
          'with the 7 Elements Professional team.',
      } satisfies RouteMeta,
    },
  },
];
