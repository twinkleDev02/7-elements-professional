import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { useScrollReveal } from '@shared/animations/scroll-reveal';

import { DISTRIBUTOR_SUPPORT } from '../../distributors.data';

@Component({
  selector: 'app-distributor-support',
  imports: [],
  templateUrl: './distributor-support.component.html',
  styleUrl: './distributor-support.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DistributorSupportComponent {
  readonly content = input(DISTRIBUTOR_SUPPORT);

  constructor() {
    useScrollReveal(({ q, revealUp }) => {
      revealUp(q('.distributor-support__reveal'), { y: 20, stagger: 0.08, duration: 0.7 });
    });
  }
}
