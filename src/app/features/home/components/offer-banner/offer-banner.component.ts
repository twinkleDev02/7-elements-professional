import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { useScrollReveal } from '@shared/animations/scroll-reveal';
import { ROUTES } from '@shared/utils/app.constants';

@Component({
  selector: 'app-offer-banner',
  imports: [RouterLink],
  templateUrl: './offer-banner.component.html',
  styleUrl: './offer-banner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfferBannerComponent {
  readonly heading = input('Special 25% OFF');
  readonly subheading = input('On Selected Products');
  readonly ctaLabel = input('Shop Now');
  readonly ctaLink = input(`/${ROUTES.products}`);

  constructor() {
    useScrollReveal(({ q, revealUp, parallax }) => {
      revealUp(q('.offer-banner__reveal'), { stagger: 0.1 });
      // The product cluster drifts against the red field as the banner passes.
      parallax(q('.offer-banner__image'), 6);
    });
  }
}
