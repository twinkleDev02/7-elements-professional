import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { useScrollReveal } from '@shared/animations/scroll-reveal';
import { ROUTES } from '@shared/utils/app.constants';

import { PRODUCTS_CTA } from '../../product.data';

@Component({
  selector: 'app-products-cta',
  imports: [RouterLink],
  templateUrl: './products-cta.component.html',
  styleUrl: './products-cta.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsCtaComponent {
  protected readonly content = PRODUCTS_CTA;
  protected readonly ctaLink = `/${ROUTES.contact}`;

  constructor() {
    useScrollReveal(({ q, revealUp, parallax }) => {
      revealUp(q('.products-cta__reveal'), { y: 24, stagger: 0.1 });
      parallax(q('.products-cta__image'), 5);
    });
  }
}
