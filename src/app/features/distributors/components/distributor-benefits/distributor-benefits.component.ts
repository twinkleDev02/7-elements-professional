import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { useScrollReveal } from '@shared/animations/scroll-reveal';

import { DistributorBenefit } from '../../distributors.model';

/**
 * Benefit list.
 *
 * `variant` switches between the page's two treatments — the left-hand list on
 * the hero column, and the boxed "Why partner with us?" panel — without a
 * second component.
 */
@Component({
  selector: 'app-distributor-benefits',
  imports: [],
  templateUrl: './distributor-benefits.component.html',
  styleUrl: './distributor-benefits.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DistributorBenefitsComponent {
  readonly benefits = input.required<readonly DistributorBenefit[]>();
  readonly title = input<string>();
  readonly variant = input<'list' | 'panel'>('list');

  constructor() {
    useScrollReveal(({ q, revealUp }) => {
      revealUp(q('.distributor-benefits__title'), { y: 18, duration: 0.7 });
      revealUp(q('.distributor-benefits__item'), {
        x: -22,
        y: 0,
        stagger: 0.08,
        duration: 0.7,
      });
    });
  }
}
