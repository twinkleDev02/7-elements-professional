/**
 * Best-selling products shown in the home carousel.
 *
 * Structured data so the carousel takes any number of entries. Swap for an API
 * response when the backend exists — the component accepts the list as an input
 * and falls back to this.
 *
 * Prices are included because the reference design shows them. Note that the
 * catalogue positions the brand as salon-only, sold through authorised
 * professional channels and explicitly not online — so public pricing and an
 * add-to-cart control may not be wanted. Flagged rather than decided here.
 */
export interface BestSellerData {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  /** Volume as printed on the bottle, e.g. `500ml`. */
  readonly size: string;
  readonly price: number;
  readonly currency: string;
  /** Out of 5, to one decimal place. */
  readonly rating: number;
  readonly reviewCount: number;
  readonly image: string;
  readonly imageAlt: string;
}

const IMAGE_BASE = 'assets/images';

export const BEST_SELLERS: readonly BestSellerData[] = [
  {
    id: 'nano-plex-shampoo',
    slug: 'nano-plex-shampoo',
    name: 'Nano Plex Shampoo',
    size: '500ml',
    price: 1750,
    currency: 'INR',
    rating: 4.8,
    reviewCount: 213,
    image: `${IMAGE_BASE}/products/Product-plex_post_shampoo.png`,
    imageAlt: 'Nano Plex shampoo bottle',
  },
  {
    id: 'keratin-treatment',
    slug: 'keratin-treatment',
    name: 'Keratin Treatment',
    size: '500ml',
    price: 2250,
    currency: 'INR',
    rating: 4.9,
    reviewCount: 178,
    image: `${IMAGE_BASE}/collections/keration_smooth.png`,
    imageAlt: 'Keratin smoothing treatment',
  },
  {
    id: 'argan-hair-mask',
    slug: 'argan-hair-mask',
    name: 'Argan Hair Mask',
    size: '500ml',
    price: 1950,
    currency: 'INR',
    rating: 4.7,
    reviewCount: 156,
    image: `${IMAGE_BASE}/collections/argan_oil_sharpoo_and_mask.png`,
    imageAlt: 'Argan hair mask jar',
  },
  {
    id: 'hair-serum',
    slug: 'hair-serum-keratin-infusion',
    name: 'Hair Serum Keratin Infusion',
    size: '100ml',
    price: 1450,
    currency: 'INR',
    rating: 4.8,
    reviewCount: 241,
    image: `${IMAGE_BASE}/collections/hair_serum.png`,
    imageAlt: 'Keratin infusion hair serum with dropper',
  },
  {
    id: 'nano-plex-mask',
    slug: 'nano-plex-mask',
    name: 'Nano Plex Mask',
    size: '500ml',
    price: 2100,
    currency: 'INR',
    rating: 4.9,
    reviewCount: 132,
    image: `${IMAGE_BASE}/products/Product-plex_post_mask.png`,
    imageAlt: 'Nano Plex hair mask jar',
  },
  {
    id: 'nanoplastia-treatment',
    slug: 'nanoplastia-treatment',
    name: 'Nanoplastia Treatment',
    size: '1000ml',
    price: 4250,
    currency: 'INR',
    rating: 5,
    reviewCount: 96,
    image: `${IMAGE_BASE}/collections/nano-plastia.png`,
    imageAlt: 'Nanoplastia professional salon treatment',
  },
  {
    id: 'shea-butter-mask',
    slug: 'shea-butter-mask',
    name: 'Shea Butter Hair Mask',
    size: '500ml',
    price: 1850,
    currency: 'INR',
    rating: 4.6,
    reviewCount: 118,
    image: `${IMAGE_BASE}/collections/shea_butter.png`,
    imageAlt: 'Shea butter hair mask jar',
  },
  {
    id: 'coffee-hair-spa',
    slug: 'coffee-hair-spa',
    name: 'Coffee Hair Spa',
    size: '500ml',
    price: 1650,
    currency: 'INR',
    rating: 4.7,
    reviewCount: 87,
    image: `${IMAGE_BASE}/collections/coffee_hair_spa.png`,
    imageAlt: 'Coffee extract hair spa treatment',
  },
];
