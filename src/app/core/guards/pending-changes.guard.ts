import { CanDeactivateFn } from '@angular/router';

/** Implemented by any component that can hold unsaved visitor input. */
export interface HasPendingChanges {
  /** Return true when navigating away would lose work. */
  hasPendingChanges(): boolean;
}

/**
 * Warns before navigating away from a partly filled form.
 *
 * ```ts
 * { path: 'contact', component: Contact, canDeactivate: [pendingChangesGuard] }
 * ```
 */
export const pendingChangesGuard: CanDeactivateFn<HasPendingChanges> = (component) => {
  if (!component?.hasPendingChanges?.()) {
    return true;
  }

  return confirm('You have unsaved changes. Leave this page and discard them?');
};
