import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { gsap } from 'gsap';

import { ROUTES } from '@shared/utils/app.constants';
import { isBrowser, prefersReducedMotion } from '@shared/utils/platform.util';

import { PRODUCTS_HERO } from '../../product.data';

@Component({
  selector: 'app-products-hero',
  imports: [RouterLink],
  templateUrl: './products-hero.component.html',
  styleUrl: './products-hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsHeroComponent {
  private readonly host = inject(ElementRef<HTMLElement>).nativeElement as HTMLElement;
  private readonly destroyRef = inject(DestroyRef);

  protected readonly content = PRODUCTS_HERO;
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

        gsap
          .timeline({ defaults: { ease: 'power3.out', duration: 0.9 } })
          .from(q('.products-hero__breadcrumb'), { autoAlpha: 0, y: 12 }, 0.25)
          .from(q('.products-hero__eyebrow'), { autoAlpha: 0, y: 16 }, 0.35)
          // Masked lines, so each wipes up from behind the one above it.
          .from(q('.products-hero__title-line'), { yPercent: 115, autoAlpha: 0, stagger: 0.11 }, 0.45)
          .from(q('.products-hero__body'), { autoAlpha: 0, y: 20 }, 0.75)
          .from(q('.products-hero__cta'), { autoAlpha: 0, y: 20, scale: 0.95 }, 0.88);
      }, this.host);

      this.destroyRef.onDestroy(() => context.revert());
    });
  }
}
