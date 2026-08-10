import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  input,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { gsap } from 'gsap';

import { NewsletterBandComponent } from '@features/home/components/newsletter-band/newsletter-band.component';
import { ROUTES } from '@shared/utils/app.constants';
import { isBrowser, prefersReducedMotion } from '@shared/utils/platform.util';

import { ProductBenefitsComponent } from './components/product-benefits/product-benefits.component';
import { ProductGalleryComponent } from './components/product-gallery/product-gallery.component';
import { ProductInfoComponent, PurchaseIntent } from './components/product-info/product-info.component';
import { ProductTabsComponent } from './components/product-tabs/product-tabs.component';
import { ProductVideoComponent } from './components/product-video/product-video.component';
import { PromoBannerComponent } from './components/promo-banner/promo-banner.component';
import { RelatedProductsComponent } from './components/related-products/related-products.component';
import {
  PRODUCT_TRUST_BADGES,
  relatedProducts,
  resolveProductDetail,
} from './product-detail.data';

/**
 * Product detail page.
 *
 * `slug` arrives from the route through `withComponentInputBinding()`, so no
 * `ActivatedRoute` plumbing is needed. Everything else is derived from it.
 */
@Component({
  selector: 'app-product-detail',
  imports: [
    RouterLink,
    ProductGalleryComponent,
    ProductInfoComponent,
    ProductBenefitsComponent,
    ProductTabsComponent,
    ProductVideoComponent,
    RelatedProductsComponent,
    PromoBannerComponent,
    NewsletterBandComponent,
  ],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetail {
  private readonly host = inject(ElementRef<HTMLElement>).nativeElement as HTMLElement;
  private readonly destroyRef = inject(DestroyRef);

  /** Bound from the `:slug` route param. */
  readonly slug = input.required<string>();

  protected readonly product = computed(() => resolveProductDetail(this.slug()));
  protected readonly related = computed(() => relatedProducts(this.slug()));
  protected readonly trustBadges = PRODUCT_TRUST_BADGES;

  protected readonly homeLink = `/${ROUTES.home}`;
  protected readonly productsLink = `/${ROUTES.products}`;

  constructor() {
    if (!isBrowser()) {
      return;
    }

    afterNextRender(() => {
      if (prefersReducedMotion()) {
        return;
      }

      const context = gsap.context((self) => {
        const q = self.selector as gsap.utils.SelectorFunc;

        // The buy column reveals as one staggered run. The gallery runs its own
        // entrance, so it is not repeated here.
        gsap.from(q('.product-info__reveal'), {
          autoAlpha: 0,
          y: 24,
          stagger: 0.08,
          duration: 0.8,
          ease: 'power3.out',
          delay: 0.15,
          clearProps: 'transform,opacity,visibility',
        });
      }, this.host);

      this.destroyRef.onDestroy(() => context.revert());
    });
  }

  protected onAddToCart(intent: PurchaseIntent): void {
    // TODO: wire to the cart/enquiry service. Left as a no-op rather than
    // guessing, because the catalogue positions the brand as salon-only.
    void intent;
  }

  protected onBuyNow(intent: PurchaseIntent): void {
    // TODO: route into checkout, or into the salon enquiry flow.
    void intent;
  }
}
