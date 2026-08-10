import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { useScrollReveal } from '@shared/animations/scroll-reveal';
import { SnapCarouselDirective } from '@shared/directives/snap-carousel.directive';
import { ROUTES } from '@shared/utils/app.constants';
import { formatPrice } from '@shared/utils/string.util';

import { BEST_SELLERS, BestSellerData } from './best-sellers.data';

/** Star positions, so the template loops instead of repeating five glyphs. */
const STAR_SLOTS = [1, 2, 3, 4, 5] as const;

@Component({
  selector: 'app-best-sellers',
  imports: [RouterLink, SnapCarouselDirective],
  templateUrl: './best-sellers.component.html',
  styleUrl: './best-sellers.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BestSellersComponent {
  readonly products = input<readonly BestSellerData[]>(BEST_SELLERS);
  readonly eyebrow = input('Best Sellers');
  readonly heading = input('Our Most Loved Products');
  readonly description = input('Trusted by professionals, loved by thousands.');

  /** Emitted instead of mutating a cart, so the page owns that decision. */
  readonly addToBag = output<BestSellerData>();

  protected readonly stars = STAR_SLOTS;
  protected readonly allProductsLink = `/${ROUTES.products}`;

  constructor() {
    useScrollReveal(({ q, revealUp, parallax }) => {
      revealUp(q('.best-sellers__reveal'));

      revealUp(q('.best-sellers__card'), {
        y: 44,
        scale: 0.95,
        stagger: 0.09,
        scrollTrigger: { trigger: q('.best-sellers__carousel')[0], start: 'top 85%', once: true },
      });

      parallax(q('.best-sellers__carousel'), 3);
    });
  }

  protected productLink(product: BestSellerData): string {
    return `/${ROUTES.products}/${product.slug}`;
  }

  protected displayPrice(product: BestSellerData): string {
    return formatPrice(product.price, product.currency);
  }

  protected onAddToBag(event: Event, product: BestSellerData): void {
    // The card is a link; the control inside it must not navigate.
    event.preventDefault();
    event.stopPropagation();
    this.addToBag.emit(product);
  }
}
