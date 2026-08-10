import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { RevealOnScrollDirective } from '@shared/directives/reveal-on-scroll.directive';
import { ROUTES } from '@shared/utils/app.constants';
import { formatPrice } from '@shared/utils/string.util';

import { ProductListing } from '../../product.data';

/** Star positions, so the template loops instead of repeating five glyphs. */
const STAR_SLOTS = [1, 2, 3, 4, 5] as const;

/**
 * Product grid.
 *
 * Presentational: it renders whatever list it is given and emits intent. The
 * page owns filtering and paging, so the grid stays reusable for search
 * results, a category page, or a wishlist.
 *
 * The entrance is CSS rather than GSAP on purpose. `RevealOnScrollDirective`
 * puts `is-revealed` on the grid, which un-pauses each card's animation; cards
 * appended later by "Load More" animate on insert, because a CSS animation
 * runs when the element is created. A GSAP timeline would have to be re-run
 * against only the new nodes every time the list grew.
 */
@Component({
  selector: 'app-product-grid',
  imports: [RouterLink, RevealOnScrollDirective],
  templateUrl: './product-grid.component.html',
  styleUrl: './product-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductGridComponent {
  readonly products = input.required<readonly ProductListing[]>();

  readonly addToCart = output<ProductListing>();
  readonly toggleWishlist = output<ProductListing>();
  readonly quickView = output<ProductListing>();

  protected readonly stars = STAR_SLOTS;

  protected productLink(product: ProductListing): string {
    return `/${ROUTES.products}/${product.slug}`;
  }

  protected displayPrice(product: ProductListing): string {
    return formatPrice(product.price, product.currency);
  }

  /** Percentage width of the filled star overlay. */
  protected ratingWidth(product: ProductListing): number {
    return (product.rating / 5) * 100;
  }
}
