import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { useScrollReveal } from '@shared/animations/scroll-reveal';
import { ROUTES } from '@shared/utils/app.constants';

import { PROMO_COLLECTION, PROMO_FEATURES, ProductFeature } from '../../product.data';

@Component({
  selector: 'app-promo-collection',
  imports: [RouterLink],
  templateUrl: './promo-collection.component.html',
  styleUrl: './promo-collection.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromoCollectionComponent {
  readonly features = input<readonly ProductFeature[]>(PROMO_FEATURES);

  protected readonly content = PROMO_COLLECTION;
  protected readonly ctaLink = `/${ROUTES.products}`;

  constructor() {
    useScrollReveal(({ q, revealUp }) => {
      revealUp(q('.promo-collection__reveal'), { y: 24, stagger: 0.09 });
      // The credentials read as one row now, so they rise together rather than
      // sliding in from the side as a column did.
      revealUp(q('.promo-collection__feature'), { y: 20, stagger: 0.09 });
    });
  }
}
