/**
 * Content for the Products listing page.
 *
 * Sections take their lists as inputs and default to the consts here, so copy
 * and catalogue changes never touch a template, and an API response can replace
 * this file wholesale later.
 *
 * `iconPaths` holds raw SVG `d` values so the glyph travels with the record
 * rather than forcing a `@switch` ladder into each template.
 */

/** A filter pill. `id` of `all` is the unfiltered view. */
export interface ProductCategory {
  readonly id: string;
  readonly label: string;
}

export interface ProductListing {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  /** Matches a `ProductCategory.id`. */
  readonly categoryId: string;
  /** Shown above the name on the card. */
  readonly categoryLabel: string;
  /** Volume or format as printed on the pack. */
  readonly size: string;
  readonly price: number;
  readonly currency: string;
  /** Out of 5, to one decimal place. */
  readonly rating: number;
  readonly reviewCount: number;
  readonly image: string;
  readonly imageAlt: string;
}

/** An icon paired with a two-line label — the page's most repeated unit. */
export interface ProductFeature {
  readonly id: string;
  readonly title: string;
  readonly subtitle: string;
  readonly iconPaths: readonly string[];
}

// -----------------------------------------------------------------------------
// Shared glyphs
// -----------------------------------------------------------------------------

const ICON = {
  person: ['M12 4a3.2 3.2 0 1 1 0 6.4A3.2 3.2 0 0 1 12 4z', 'M5.5 20.5a6.5 6.5 0 0 1 13 0'],
  flask: ['M10 3h4v3.4l3.2 5.4a3 3 0 0 1-2.6 4.5H9.4a3 3 0 0 1-2.6-4.5L10 6.4z', 'M8.5 14h7'],
  leaf: [
    'M20 4c0 8.3-4.2 13-9.5 13A5.5 5.5 0 0 1 5 11.5C5 6.8 11 4 20 4z',
    'M4 20c2.5-4.5 6-7.5 11-9.5',
  ],
  droplet: ['M12 3.5c3.4 4 5.5 6.7 5.5 9.4a5.5 5.5 0 0 1-11 0c0-2.7 2.1-5.4 5.5-9.4z'],
  rabbit: [
    'M8.5 10.5c-1.2-2.6-1-5.2.6-5.7 1.5-.5 3 1.4 3.4 4',
    'M15.5 10.5c1.2-2.6 1-5.2-.6-5.7-1.5-.5-3 1.4-3.4 4',
    'M6.5 15.5a5.5 5.5 0 0 1 11 0 4 4 0 0 1-4 4h-3a4 4 0 0 1-4-4z',
  ],
  sparkle: [
    'M12 4l1.6 4.4L18 10l-4.4 1.6L12 16l-1.6-4.4L6 10l4.4-1.6z',
    'M18 15l.8 2.2L21 18l-2.2.8L18 21l-.8-2.2L15 18l2.2-.8z',
  ],
  shieldCheck: [
    'M12 3.2 19 6v6c0 4.2-2.9 7.4-7 8.8-4.1-1.4-7-4.6-7-8.8V6z',
    'M9 12.2l2.1 2.1L15.5 10',
  ],
} as const;

// -----------------------------------------------------------------------------
// Hero
// -----------------------------------------------------------------------------

export const PRODUCTS_HERO = {
  eyebrow: 'Professional Hair Care',
  /** Split so the closing phrase can carry the accent colour. */
  titleLead: 'Crafted with Science.',
  titleRest: 'Loved by ',
  titleAccent: 'Professionals.',
  body:
    'Explore our salon-quality hair care range, expertly formulated for healthy, ' +
    'stronger, shinier hair.',
  ctaLabel: 'Explore Collections',
  // image: 'assets/images/brand/product_banner.png',
  imageAlt: '7 Elements Professional range arranged on a marble podium with blossoms',
} as const;

// -----------------------------------------------------------------------------
// Filters
// -----------------------------------------------------------------------------

export const PRODUCT_CATEGORIES: readonly ProductCategory[] = [
  { id: 'all', label: 'All Products' },
  { id: 'nano-plex', label: 'Nano Plex' },
  { id: 'keratin', label: 'Keratin' },
  { id: 'nanoplastia', label: 'Nanoplastia' },
  { id: 'argan', label: 'Argan' },
  { id: 'hair-spa', label: 'Hair Spa' },
  { id: 'essentials', label: 'Hair Essentials' },
];

/** Products shown before "Load More" is pressed. */
export const PRODUCTS_PER_PAGE = 8;

// -----------------------------------------------------------------------------
// Catalogue
// -----------------------------------------------------------------------------

const IMAGE_BASE = 'assets/images/products';

export const PRODUCT_LISTINGS: readonly ProductListing[] = [
  {
    id: 'nano-plex-shampoo',
    slug: 'nano-plex-shampoo',
    name: 'Nano Plex Shampoo',
    categoryId: 'nano-plex',
    categoryLabel: 'Nano Plex',
    size: '500ml',
    price: 1750,
    currency: 'INR',
    rating: 4.8,
    reviewCount: 128,
    image: `${IMAGE_BASE}/Product-plex_post_shampoo.png`,
    imageAlt: 'Nano Plex Shampoo bottle',
  },
  {
    id: 'keratin-treatment',
    slug: 'keratin-treatment',
    name: 'Keratin Treatment',
    categoryId: 'keratin',
    categoryLabel: 'Keratin',
    size: '500ml',
    price: 2250,
    currency: 'INR',
    rating: 4.9,
    reviewCount: 96,
    image: `${IMAGE_BASE}/Product_keratin_conditioner.png`,
    imageAlt: 'Keratin Treatment bottle',
  },
  {
    id: 'argan-hair-mask',
    slug: 'argan-hair-mask',
    name: 'Argan Hair Mask',
    categoryId: 'argan',
    categoryLabel: 'Argan',
    size: '500ml',
    price: 1950,
    currency: 'INR',
    rating: 4.7,
    reviewCount: 112,
    image: `${IMAGE_BASE}/Product_argan_mask.png`,
    imageAlt: 'Argan Hair Mask jar',
  },
  {
    id: 'hair-serum',
    slug: 'hair-serum-keratin-infusion',
    name: 'Hair Serum Keratin Infusion',
    categoryId: 'essentials',
    categoryLabel: 'Essentials',
    size: '100ml',
    price: 1450,
    currency: 'INR',
    rating: 4.8,
    reviewCount: 89,
    image: `${IMAGE_BASE}/Product_hair_serum.png`,
    imageAlt: 'Hair Serum Keratin Infusion bottle',
  },
  {
    id: 'nano-plex-mask',
    slug: 'nano-plex-hair-mask',
    name: 'Nano Plex Hair Mask',
    categoryId: 'nano-plex',
    categoryLabel: 'Nano Plex',
    size: '500ml',
    price: 1950,
    currency: 'INR',
    rating: 4.7,
    reviewCount: 76,
    image: `${IMAGE_BASE}/Product-plex_post_mask.png`,
    imageAlt: 'Nano Plex Hair Mask jar',
  },
  {
    id: 'keratin-shampoo',
    slug: 'keratin-shampoo',
    name: 'Keratin Shampoo',
    categoryId: 'keratin',
    categoryLabel: 'Keratin',
    size: '500ml',
    price: 1750,
    currency: 'INR',
    rating: 4.8,
    reviewCount: 104,
    image: `${IMAGE_BASE}/Product_keratin_shampoo.png`,
    imageAlt: 'Keratin Shampoo bottle',
  },
  {
    id: 'hair-spa-kit',
    slug: 'hair-spa-kit',
    name: 'Hair Spa Kit',
    categoryId: 'hair-spa',
    categoryLabel: 'Hair Spa',
    size: '3 Steps',
    price: 3850,
    currency: 'INR',
    rating: 4.9,
    reviewCount: 63,
    image: `${IMAGE_BASE}/Product_hyderamask.png`,
    imageAlt: 'Hair Spa Kit three-step set',
  },
  {
    id: 'nanoplastia-treatment',
    slug: 'nanoplastia-treatment',
    name: 'Nanoplastia Treatment',
    categoryId: 'nanoplastia',
    categoryLabel: 'Nanoplastia',
    size: '500ml',
    price: 2450,
    currency: 'INR',
    rating: 4.9,
    reviewCount: 58,
    image: `${IMAGE_BASE}/product_nanoplastia.png`,
    imageAlt: 'Nanoplastia Treatment bottle',
  },

  // Revealed by "Load More".
  {
    id: 'moroccan-argan-oil',
    slug: 'moroccan-argan-oil',
    name: 'Moroccan Argan Oil',
    categoryId: 'argan',
    categoryLabel: 'Argan',
    size: '100ml',
    price: 1650,
    currency: 'INR',
    rating: 4.9,
    reviewCount: 143,
    image: `${IMAGE_BASE}/Product_argun_oil.png`,
    imageAlt: 'Moroccan Argan Oil bottle',
  },
  {
    id: 'argan-shampoo',
    slug: 'argan-shampoo',
    name: 'Argan Shampoo',
    categoryId: 'argan',
    categoryLabel: 'Argan',
    size: '500ml',
    price: 1550,
    currency: 'INR',
    rating: 4.6,
    reviewCount: 91,
    image: `${IMAGE_BASE}/Product_argun_shampoo.png`,
    imageAlt: 'Argan Shampoo bottle',
  },
  {
    id: 'shea-butter-mask',
    slug: 'shea-butter-hair-mask',
    name: 'Shea Butter Hair Mask',
    categoryId: 'essentials',
    categoryLabel: 'Essentials',
    size: '500ml',
    price: 1850,
    currency: 'INR',
    rating: 4.6,
    reviewCount: 118,
    image: `${IMAGE_BASE}/Product_shea_butter.png`,
    imageAlt: 'Shea Butter Hair Mask jar',
  },
  {
    id: 'coffee-hair-spa',
    slug: 'coffee-hair-spa',
    name: 'Coffee Hair Spa',
    categoryId: 'hair-spa',
    categoryLabel: 'Hair Spa',
    size: '500ml',
    price: 1650,
    currency: 'INR',
    rating: 4.7,
    reviewCount: 87,
    image: `${IMAGE_BASE}/Product_coffee_hair_spa.png`,
    imageAlt: 'Coffee Hair Spa treatment jar',
  },
  {
    id: 'brazilian-hair-spa',
    slug: 'brazilian-hair-spa',
    name: 'Brazilian Hair Spa',
    categoryId: 'hair-spa',
    categoryLabel: 'Hair Spa',
    size: '500ml',
    price: 1750,
    currency: 'INR',
    rating: 4.8,
    reviewCount: 74,
    image: `${IMAGE_BASE}/Product_brazillian_spa.png`,
    imageAlt: 'Brazilian Hair Spa treatment jar',
  },
  {
    id: 'nano-plex-pre-shampoo',
    slug: 'nano-plex-pre-shampoo',
    name: 'Nano Plex Pre-Shampoo',
    categoryId: 'nano-plex',
    categoryLabel: 'Nano Plex',
    size: '500ml',
    price: 1890,
    currency: 'INR',
    rating: 4.8,
    reviewCount: 69,
    image: `${IMAGE_BASE}/Product-plex_pre_shampoo.png`,
    imageAlt: 'Nano Plex Pre-Shampoo bottle',
  },
];

// -----------------------------------------------------------------------------
// Promotional collection band
// -----------------------------------------------------------------------------

export const PROMO_COLLECTION = {
  eyebrow: 'Premium Care Collection',
  titleLines: ['Discover The 7 Elements', 'Luxury Hair Care'],
  body:
    'Advanced formulations crafted for professionals. Nourish, repair and transform ' +
    'every strand.',
  ctaLabel: 'Explore Collection',
  image: 'assets/images/collections/nano-plex.png',
  imageAlt: '7 Elements Professional luxury range with foliage',
} as const;

export const PROMO_FEATURES: readonly ProductFeature[] = [
  { id: 'salon-trusted', title: 'Salon Trusted', subtitle: 'Professional Grade', iconPaths: ICON.person },
  { id: 'advanced', title: 'Advanced', subtitle: 'Formulations', iconPaths: ICON.flask },
  { id: 'safe-natural', title: 'Safe & Natural', subtitle: 'Ingredients', iconPaths: ICON.rabbit },
];

// -----------------------------------------------------------------------------
// Trust strip
// -----------------------------------------------------------------------------

export const PRODUCT_TRUST: readonly ProductFeature[] = [
  { id: 'salon-professional', title: 'Salon Professional', subtitle: 'Trusted by Experts', iconPaths: ICON.person },
  { id: 'premium-quality', title: 'Premium Quality', subtitle: 'Luxury Formulation', iconPaths: ICON.shieldCheck },
  { id: 'safe-ingredients', title: 'Safe Ingredients', subtitle: 'No Harmful Chemicals', iconPaths: ICON.droplet },
  { id: 'cruelty-free', title: 'Cruelty Free', subtitle: 'We Never Test on Animals', iconPaths: ICON.rabbit },
  { id: 'visible-results', title: 'Visible Results', subtitle: 'Loved by Thousands', iconPaths: ICON.sparkle },
];

// -----------------------------------------------------------------------------
// Closing call to action
// -----------------------------------------------------------------------------

export const PRODUCTS_CTA = {
  title: 'Ready to Transform Your Hair?',
  body: 'Join thousands of professionals who trust 7 Elements Professional.',
  ctaLabel: 'Contact Us Today',
  image: 'assets/images/brand/home_.png',
  imageAlt: 'Model with long, lustrous waves',
} as const;
