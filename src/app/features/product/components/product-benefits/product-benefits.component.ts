import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { useScrollReveal } from '@shared/animations/scroll-reveal';

import { ProductFeature } from '../../product.data';

@Component({
  selector: 'app-product-benefits',
  imports: [],
  templateUrl: './product-benefits.component.html',
  styleUrl: './product-benefits.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductBenefitsComponent {
  readonly benefits = input.required<readonly ProductFeature[]>();

  constructor() {
    useScrollReveal(({ q, revealUp }) => {
      revealUp(q('.product-benefits__item'), { y: 22, scale: 0.94, stagger: 0.08, duration: 0.7 });
    });
  }
}
