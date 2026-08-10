import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { useScrollReveal } from '@shared/animations/scroll-reveal';

import { FORM_STEPS } from '../../distributors.data';
import { FormStep } from '../../distributors.model';

/**
 * Registration progress indicator.
 *
 * Presentational — the form owns which step is active, so the two cannot drift.
 */
@Component({
  selector: 'app-distributor-progress',
  imports: [],
  templateUrl: './distributor-progress.component.html',
  styleUrl: './distributor-progress.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DistributorProgressComponent {
  readonly steps = input<readonly FormStep[]>(FORM_STEPS);
  /** Zero-based index of the step in progress. */
  readonly activeIndex = input(0);

  constructor() {
    useScrollReveal(({ q, revealUp }) => {
      revealUp(q('.distributor-progress__step'), { y: 18, stagger: 0.12, duration: 0.65 });
    });
  }

  protected isComplete(index: number): boolean {
    return index < this.activeIndex();
  }

  protected isActive(index: number): boolean {
    return index === this.activeIndex();
  }
}
