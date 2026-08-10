import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Product, ProductVariant } from '@shared/models/product.model';
import { ROUTES } from '@shared/utils/app.constants';
import { formatPrice } from '@shared/utils/string.util';

/**
 * Product tile for listings, carousels and cross-sells.
 *
 * Presentational only: it derives what it shows from the `product` input and
 * emits intent upward. It never fetches, and it never adds to a cart itself.
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

  /** Hides the quick-add control for contexts where it would be noise. */
  readonly showQuickAdd = input(true);

  readonly quickAdd = output<ProductVariant>();

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

  protected onQuickAdd(event: Event): void {
    // The card is wrapped in a link; the control inside it must not navigate.
    event.preventDefault();
    event.stopPropagation();

    const variant = this.primaryVariant();

    if (variant?.inStock) {
      this.quickAdd.emit(variant);
    }
  }
}
