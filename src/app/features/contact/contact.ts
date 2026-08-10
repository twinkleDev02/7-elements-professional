import { ChangeDetectionStrategy, Component, viewChild } from '@angular/core';

import { NewsletterBandComponent } from '@features/home/components/newsletter-band/newsletter-band.component';
import { HasPendingChanges } from '@core/guards/pending-changes.guard';

import { ContactFormComponent } from './components/contact-form/contact-form.component';
import { ContactHeroComponent } from './components/contact-hero/contact-hero.component';
import { ContactInfoCardsComponent } from './components/contact-info-cards/contact-info-cards.component';
import { OfficeMapComponent } from './components/office-map/office-map.component';
import { TrustBannerComponent } from './components/trust-banner/trust-banner.component';

/**
 * Contact page.
 *
 * Composition only — each section owns its markup, styling and animation.
 *
 * Implements `HasPendingChanges` for `pendingChangesGuard`, which is already
 * registered on this route. The form owns the state, so the answer is
 * delegated to it rather than duplicated here.
 */
@Component({
  selector: 'app-contact',
  imports: [
    ContactHeroComponent,
    ContactInfoCardsComponent,
    ContactFormComponent,
    OfficeMapComponent,
    TrustBannerComponent,
    NewsletterBandComponent,
  ],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Contact implements HasPendingChanges {
  private readonly form = viewChild(ContactFormComponent);

  hasPendingChanges(): boolean {
    // Undefined while the view is still being created, which is never a moment
    // a navigation can be blocked from.
    return this.form()?.hasUnsavedInput() ?? false;
  }
}
