import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { useScrollReveal } from '@shared/animations/scroll-reveal';

import { PRODUCT_CATEGORIES, ProductCategory } from '../../product.data';

/**
 * Category filter bar.
 *
 * Presentational: it renders the pills and emits the chosen id. The page owns
 * which category is active, so the grid and the filter cannot disagree.
 */
@Component({
  selector: 'app-product-filter',
  imports: [],
  templateUrl: './product-filter.component.html',
  styleUrl: './product-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductFilterComponent {
  readonly categories = input<readonly ProductCategory[]>(PRODUCT_CATEGORIES);
  readonly activeCategory = input.required<string>();
  readonly filterLabel = input('Filter');

  readonly categoryChange = output<string>();
  /** Opens the advanced filter panel, which the page owns. */
  readonly filterOpen = output<void>();

  constructor() {
    useScrollReveal(({ q, revealUp }) => {
      revealUp(q('.product-filter__pill'), { y: 16, stagger: 0.05, duration: 0.6 });
      revealUp(q('.product-filter__advanced'), { y: 16, duration: 0.6 });
    });
  }
}
