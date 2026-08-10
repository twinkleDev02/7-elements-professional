/** Hair type or concern a product is formulated for. */
export type HairConcern =
  | 'damage-repair'
  | 'colour-protection'
  | 'volume'
  | 'hydration'
  | 'scalp-care'
  | 'smoothing';

/** Product image with the alt text the design copy specifies. */
export interface ProductImage {
  readonly url: string;
  readonly alt: string;
  readonly width?: number;
  readonly height?: number;
}

/** A purchasable size/variant of a product. */
export interface ProductVariant {
  readonly id: string;
  /** e.g. `250ml`. */
  readonly size: string;
  readonly price: number;
  readonly currency: string;
  readonly inStock: boolean;
}

export interface Product {
  readonly id: string;
  /** URL segment used by the product detail route. */
  readonly slug: string;
  readonly name: string;
  /** Short line used on cards and listings. */
  readonly tagline: string;
  readonly description: string;
  readonly concerns: readonly HairConcern[];
  readonly keyIngredients: readonly string[];
  readonly images: readonly ProductImage[];
  readonly variants: readonly ProductVariant[];
  readonly featured: boolean;
}

/** Query shape accepted by the product listing endpoint. */
export interface ProductFilter {
  readonly concern?: HairConcern;
  readonly search?: string;
  readonly featuredOnly?: boolean;
}
