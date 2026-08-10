import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { ProductFilterComponent } from './components/product-filter/product-filter.component';
import { ProductGridComponent } from './components/product-grid/product-grid.component';
import { ProductsCtaComponent } from './components/products-cta/products-cta.component';
import { ProductsHeroComponent } from './components/products-hero/products-hero.component';
import { PromoCollectionComponent } from './components/promo-collection/promo-collection.component';
import { TrustStripComponent } from './components/trust-strip/trust-strip.component';
import { PRODUCTS_PER_PAGE, PRODUCT_LISTINGS, ProductListing } from './product.data';

/**
 * Products listing page.
 *
 * Owns the two pieces of state the sections share — the active category and how
 * many products are shown — so the filter bar and the grid can never disagree.
 * Each section stays presentational: data in, events out.
 */
@Component({
  selector: 'app-product-collection',
  imports: [
    ProductsHeroComponent,
    ProductFilterComponent,
    ProductGridComponent,
    PromoCollectionComponent,
    TrustStripComponent,
    ProductsCtaComponent,
  ],
  templateUrl: './product-collection.html',
  styleUrl: './product-collection.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCollection {
  protected readonly activeCategory = signal('all');
  protected readonly visibleCount = signal(PRODUCTS_PER_PAGE);

  private readonly allProducts = PRODUCT_LISTINGS;

  protected readonly filtered = computed<readonly ProductListing[]>(() => {
    const category = this.activeCategory();

    return category === 'all'
      ? this.allProducts
      : this.allProducts.filter((product) => product.categoryId === category);
  });

  protected readonly visible = computed(() => this.filtered().slice(0, this.visibleCount()));

  protected readonly hasMore = computed(() => this.visibleCount() < this.filtered().length);

  protected onCategoryChange(categoryId: string): void {
    this.activeCategory.set(categoryId);
    // Reset paging: keeping a deep offset across a filter change would show a
    // short range as though it were already fully expanded.
    this.visibleCount.set(PRODUCTS_PER_PAGE);
  }

  protected loadMore(): void {
    this.visibleCount.update((count) => count + PRODUCTS_PER_PAGE);
  }

  protected onFilterOpen(): void {
    // TODO: open the advanced filter panel (price, hair concern, size) once
    // that design exists. The button is in the reference; the panel is not.
  }

  protected onAddToCart(product: ProductListing): void {
    // TODO: wire to the cart/enquiry service. Left as a no-op rather than
    // guessing, because the catalogue positions the brand as salon-only.
    void product;
  }

  protected onToggleWishlist(product: ProductListing): void {
    // TODO: persist through StorageService once the wishlist design exists.
    void product;
  }

  protected onQuickView(product: ProductListing): void {
    // TODO: open the quick-view dialog once that design exists.
    void product;
  }
}
