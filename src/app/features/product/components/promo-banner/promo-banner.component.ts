import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { useScrollReveal } from '@shared/animations/scroll-reveal';
import { ROUTES } from '@shared/utils/app.constants';

import { DETAIL_PROMO } from '../../product-detail.data';

@Component({
  selector: 'app-promo-banner',
  imports: [RouterLink],
  templateUrl: './promo-banner.component.html',
  styleUrl: './promo-banner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromoBannerComponent {
  readonly content = input(DETAIL_PROMO);

  protected readonly ctaLink = `/${ROUTES.products}`;

  constructor() {
    useScrollReveal(({ q, revealUp, parallax }) => {
      revealUp(q('.promo-banner__reveal'), { y: 24, stagger: 0.1 });
      parallax(q('.promo-banner__image'), 6);
    });
  }
}
