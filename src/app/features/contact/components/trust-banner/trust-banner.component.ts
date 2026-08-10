import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { useScrollReveal } from '@shared/animations/scroll-reveal';

import { CONTACT_TRUST, CONTACT_TRUST_POINTS, TrustPoint } from '../../contact.data';

@Component({
  selector: 'app-trust-banner',
  imports: [],
  templateUrl: './trust-banner.component.html',
  styleUrl: './trust-banner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrustBannerComponent {
  readonly content = input(CONTACT_TRUST);
  readonly points = input<readonly TrustPoint[]>(CONTACT_TRUST_POINTS);

  constructor() {
    useScrollReveal(({ q, revealUp }) => {
      // Horizontal reveal, matching the banner's landscape composition.
      revealUp(q('.trust-banner__reveal'), { x: -28, y: 0, stagger: 0.1, duration: 0.9 });
      revealUp(q('.trust-banner__point'), { y: 22, stagger: 0.08, duration: 0.7 });
    });
  }
}
