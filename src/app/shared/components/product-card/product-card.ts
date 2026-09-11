import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Product, ProductVariant } from '@shared/models/product.model';
import { ROUTES } from '@shared/utils/app.constants';
import { formatPrice } from '@shared/utils/string.util';

/**
 * Product tile for listings, carousels and cross-sells.
 *
 * Presentational only: it derives everything it shows from the `product` input.
 * It never fetches, and it offers no cart — the brand sells through authorised
 * salons, so the one action a tile carries is a link to the stockist search.
 */
@Component({
  selector: 'app-product-card',
  imports: [RouterLink],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCard {
  readonly product = input.required<Product>();

  /**
   * Set on cards above the fold. Everything else stays lazy — a grid of eager
   * images competes with the hero for bandwidth.
   */
  readonly eager = input(false);

  /** Hides the salon-search control for contexts where it would be noise. */
  readonly showSalonSearch = input(true);

  /** The same destination as the navbar's "Find A Distributor". */
  protected readonly distributorsLink = `/${ROUTES.distributors}`;

  protected readonly image = computed(() => this.product().images[0]);

  /** Second image, if the design calls for a hover swap. */
  protected readonly hoverImage = computed(() => this.product().images[1]);

  protected readonly link = computed(() => `/${ROUTES.products}/${this.product().slug}`);

  /** Cheapest in-stock variant, falling back to the first listed. */
  protected readonly primaryVariant = computed<ProductVariant | undefined>(() => {
    const variants = this.product().variants;
    const available = variants.filter((variant) => variant.inStock);

    return [...(available.length ? available : variants)].sort((a, b) => a.price - b.price)[0];
  });

  protected readonly price = computed(() => {
    const variant = this.primaryVariant();
    return variant ? formatPrice(variant.price, variant.currency) : null;
  });

  protected readonly isSoldOut = computed(() =>
    this.product().variants.every((variant) => !variant.inStock),
  );
}
