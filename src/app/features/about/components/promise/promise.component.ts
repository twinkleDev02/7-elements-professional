import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { useScrollReveal } from '@shared/animations/scroll-reveal';

import { ABOUT_PROMISE, AboutFeature, PROMISE_ITEMS } from '../../about.data';

@Component({
  selector: 'app-promise',
  imports: [],
  templateUrl: './promise.component.html',
  styleUrl: './promise.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromiseComponent {
  readonly items = input<readonly AboutFeature[]>(PROMISE_ITEMS);

  protected readonly content = ABOUT_PROMISE;

  constructor() {
    useScrollReveal(({ q, revealUp }) => {
      revealUp(q('.promise__reveal'), { y: 24 });

      revealUp(q('.promise__item'), {
        y: 24,
        scale: 0.92,
        rotate: -4,
        stagger: 0.07,
        duration: 0.75,
      });
    });
  }
}
