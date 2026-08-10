import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';

import { formatPrice } from '@shared/utils/string.util';

import { ProductDetail, ProductSize } from '../../product-detail.data';
import { ProductFeature } from '../../product.data';

/** Emitted when a visitor commits to a size and quantity. */
export interface PurchaseIntent {
  readonly size: ProductSize;
  readonly quantity: number;
}

const STAR_SLOTS = [1, 2, 3, 4, 5] as const;
const MAX_QUANTITY = 10;

@Component({
  selector: 'app-product-info',
  imports: [],
  templateUrl: './product-info.component.html',
  styleUrl: './product-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductInfoComponent {
  readonly product = input.required<ProductDetail>();
  readonly trustBadges = input<readonly ProductFeature[]>([]);

  readonly addToCart = output<PurchaseIntent>();
  readonly buyNow = output<PurchaseIntent>();

  protected readonly stars = STAR_SLOTS;

  /** Index into `product().sizes`; the middle size is the house default. */
  protected readonly selectedSizeIndex = signal(1);
  protected readonly quantity = signal(1);

  protected readonly selectedSize = computed<ProductSize | undefined>(() => {
    const sizes = this.product().sizes;
    return sizes[this.selectedSizeIndex()] ?? sizes[0];
  });

  protected readonly displayPrice = computed(() => {
    const size = this.selectedSize();
    return size ? formatPrice(size.price, this.product().currency) : '';
  });

  /** Line total, so the figure tracks the quantity stepper. */
  protected readonly displayTotal = computed(() => {
    const size = this.selectedSize();
    return size ? formatPrice(size.price * this.quantity(), this.product().currency) : '';
  });

  protected readonly ratingWidth = computed(() => (this.product().rating / 5) * 100);

  protected readonly canDecrease = computed(() => this.quantity() > 1);
  protected readonly canIncrease = computed(() => this.quantity() < MAX_QUANTITY);

  protected selectSize(index: number): void {
    this.selectedSizeIndex.set(index);
  }

  protected decrease(): void {
    this.quantity.update((value) => Math.max(1, value - 1));
  }

  protected increase(): void {
    this.quantity.update((value) => Math.min(MAX_QUANTITY, value + 1));
  }

  protected onAddToCart(): void {
    const intent = this.buildIntent();

    if (intent) {
      this.addToCart.emit(intent);
    }
  }

  protected onBuyNow(): void {
    const intent = this.buildIntent();

    if (intent) {
      this.buyNow.emit(intent);
    }
  }

  private buildIntent(): PurchaseIntent | null {
    const size = this.selectedSize();
    return size ? { size, quantity: this.quantity() } : null;
  }
}
