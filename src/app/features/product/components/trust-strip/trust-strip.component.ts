import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { useScrollReveal } from '@shared/animations/scroll-reveal';

import { PRODUCT_TRUST, ProductFeature } from '../../product.data';

@Component({
  selector: 'app-trust-strip',
  imports: [],
  templateUrl: './trust-strip.component.html',
  styleUrl: './trust-strip.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrustStripComponent {
  readonly items = input<readonly ProductFeature[]>(PRODUCT_TRUST);

  constructor() {
    useScrollReveal(({ q, revealUp }) => {
      revealUp(q('.trust-strip__item'), { y: 20, scale: 0.94, stagger: 0.07, duration: 0.7 });
    });
  }
}
