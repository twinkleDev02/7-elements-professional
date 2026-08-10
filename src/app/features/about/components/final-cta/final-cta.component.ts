import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { useScrollReveal } from '@shared/animations/scroll-reveal';
import { ROUTES } from '@shared/utils/app.constants';

import { ABOUT_CTA, AboutFeature, CTA_ASSURANCES } from '../../about.data';

@Component({
  selector: 'app-final-cta',
  imports: [RouterLink],
  templateUrl: './final-cta.component.html',
  styleUrl: './final-cta.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinalCtaComponent {
  readonly assurances = input<readonly AboutFeature[]>(CTA_ASSURANCES);

  protected readonly content = ABOUT_CTA;
  protected readonly ctaLink = `/${ROUTES.products}`;

  constructor() {
    useScrollReveal(({ q, revealUp, parallax }) => {
      revealUp(q('.final-cta__reveal'), { y: 26, stagger: 0.1 });
      revealUp(q('.final-cta__assurance'), { y: 22, stagger: 0.09 });

      // The botanical field drifts behind the copy as the band passes.
      parallax(q('.final-cta__backdrop'), 8);
    });
  }
}
