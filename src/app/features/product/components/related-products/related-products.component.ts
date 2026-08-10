import {
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
  input,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { useScrollReveal } from '@shared/animations/scroll-reveal';
import { ROUTES } from '@shared/utils/app.constants';
import { isBrowser } from '@shared/utils/platform.util';
import { formatPrice } from '@shared/utils/string.util';
import { registerSwiperElements } from '@shared/utils/swiper.util';

import { ProductListing } from '../../product.data';

registerSwiperElements();

@Component({
  selector: 'app-related-products',
  imports: [RouterLink],
  templateUrl: './related-products.component.html',
  styleUrl: './related-products.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // Required for `<swiper-container>` / `<swiper-slide>`.
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RelatedProductsComponent {
  readonly products = input.required<readonly ProductListing[]>();
  readonly heading = input('You May Also Like');

  private readonly carousel = viewChild<ElementRef<HTMLElement>>('carousel');

  constructor() {
    useScrollReveal(({ q, revealUp }) => {
      revealUp(q('.related-products__reveal'), { y: 22 });
    });

    if (!isBrowser()) {
      return;
    }

    afterNextRender(() => this.initCarousel());
  }

  /**
   * Swiper Element is initialised manually (`init="false"` in the template):
   * breakpoint maps cannot be expressed as HTML attributes, which is the
   * documented threshold for configuring in script instead.
   */
  private initCarousel(): void {
    const element = this.carousel()?.nativeElement as (HTMLElement & {
      initialize?: () => void;
    }) | undefined;

    if (!element?.initialize) {
      return;
    }

    Object.assign(element, {
      slidesPerView: 1.2,
      spaceBetween: 12,
      grabCursor: true,
      watchOverflow: true,
      navigation: {
        nextEl: '.related-products__nav--next',
        prevEl: '.related-products__nav--prev',
      },
      breakpoints: {
        576: { slidesPerView: 2.2, spaceBetween: 12 },
        768: { slidesPerView: 3.2, spaceBetween: 14 },
        992: { slidesPerView: 4, spaceBetween: 16 },
        1280: { slidesPerView: 5, spaceBetween: 16 },
      },
    });

    element.initialize();
  }

  protected productLink(product: ProductListing): string {
    return `/${ROUTES.products}/${product.slug}`;
  }

  protected displayPrice(product: ProductListing): string {
    return formatPrice(product.price, product.currency);
  }
}
