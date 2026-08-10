import { ProductImage } from './product.model';

/** A curated grouping of products — a ritual, a range, or a concern. */
export interface Collection {
  readonly id: string;
  /** URL segment used by the collection route. */
  readonly slug: string;
  readonly title: string;
  readonly description?: string;
  readonly image: ProductImage;
  /** Shown as a count badge on the card when present. */
  readonly productCount?: number;
}
