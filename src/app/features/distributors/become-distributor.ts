import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';

import { NewsletterBandComponent } from '@features/home/components/newsletter-band/newsletter-band.component';
import { HasPendingChanges } from '@core/guards/pending-changes.guard';

import { DistributorBenefitsComponent } from './components/distributor-benefits/distributor-benefits.component';
import { DistributorFormComponent } from './components/distributor-form/distributor-form.component';
import { DistributorHeroComponent } from './components/distributor-hero/distributor-hero.component';
import { DistributorProgressComponent } from './components/distributor-progress/distributor-progress.component';
import { DistributorSupportComponent } from './components/distributor-support/distributor-support.component';
import { BECOME_BENEFITS, BECOME_HERO, PARTNER_REASONS } from './distributors.data';
import { DistributorApplication } from './distributors.model';

/**
 * Become a Distributor.
 *
 * Holds only the progress step, which the form reports as sections complete —
 * so the indicator and the form can never disagree about where the visitor is.
 *
 * Implements `HasPendingChanges` so a half-filled application warns before it
 * is abandoned; the answer is delegated to the form, which owns the state.
 */
@Component({
  selector: 'app-become-distributor',
  imports: [
    DistributorHeroComponent,
    DistributorProgressComponent,
    DistributorFormComponent,
    DistributorBenefitsComponent,
    DistributorSupportComponent,
    NewsletterBandComponent,
  ],
  templateUrl: './become-distributor.html',
  styleUrl: './become-distributor.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BecomeDistributor implements HasPendingChanges {
  private readonly form = viewChild(DistributorFormComponent);

  protected readonly hero = BECOME_HERO;
  protected readonly benefits = BECOME_BENEFITS;
  protected readonly partnerReasons = PARTNER_REASONS;

  protected readonly activeStep = signal(0);

  hasPendingChanges(): boolean {
    // Undefined while the view is still being created, which is never a moment
    // a navigation can be blocked from.
    return this.form()?.hasUnsavedInput() ?? false;
  }

  protected onStepChange(step: number): void {
    this.activeStep.set(step);
  }

  protected onSubmitted(application: DistributorApplication): void {
    // TODO: post to the partnerships endpoint once it exists. The form reports
    // success locally rather than pretending to have sent anything.
    void application;
  }
}
