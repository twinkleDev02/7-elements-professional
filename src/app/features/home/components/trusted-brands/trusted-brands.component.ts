import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { useScrollReveal } from '@shared/animations/scroll-reveal';

/**
 * A partner wordmark.
 *
 * Rendered as styled type rather than an image file: the reference logos are
 * purely typographic, so text stays crisp at any density, needs no asset, and
 * the muted-to-colour hover is a simple colour change instead of a
 * `filter: grayscale()` repaint. Swap `lead`/`trail` for an `<img>` here if a
 * partner supplies a real logo.
 */
export interface PartnerBrand {
  readonly id: string;
  /** Emphasised first word. */
  readonly lead: string;
  /** Smaller, letterspaced second line. */
  readonly trail: string;
  /** Set for wordmarks the reference sets in the display serif. */
  readonly serif?: boolean;
}

const PARTNERS: readonly PartnerBrand[] = [
  { id: 'salon-experts', lead: 'salon', trail: 'Experts' },
  { id: 'hair-studio', lead: 'Hair', trail: 'Studio' },
  { id: 'beauty-lounge', lead: 'Beauty', trail: 'Lounge', serif: true },
  { id: 'luxe-salon', lead: 'Luxe', trail: 'Salon' },
  { id: 'glamour', lead: 'glamour', trail: 'Professional', serif: true },
];

@Component({
  selector: 'app-trusted-brands',
  imports: [],
  templateUrl: './trusted-brands.component.html',
  styleUrl: './trusted-brands.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrustedBrandsComponent {
  readonly heading = input('Trusted By Professionals Worldwide');
  readonly partners = input<readonly PartnerBrand[]>(PARTNERS);

  constructor() {
    useScrollReveal(({ q, revealUp }) => {
      revealUp(q('.trusted-brands__reveal'));
      revealUp(q('.trusted-brands__item'), { y: 20, stagger: 0.07 });
    });
  }
}
