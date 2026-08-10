import { PRODUCT_LISTINGS, ProductFeature, ProductListing } from './product.data';

/** A purchasable size. Prices are per size, not per product. */
export interface ProductSize {
  readonly id: string;
  readonly label: string;
  readonly price: number;
  readonly inStock: boolean;
}

/** One gallery entry — a still, or the video slide. */
export interface GalleryItem {
  readonly id: string;
  readonly type: 'image' | 'video';
  readonly src: string;
  readonly alt: string;
  /** Poster frame for a video entry. */
  readonly poster?: string;
}

export interface ProductFaq {
  readonly id: string;
  readonly question: string;
  readonly answer: string;
}

export interface ProductVideo {
  readonly src: string;
  /**
   * Poster frame. Left undefined deliberately — no poster asset exists yet, and
   * a stand-in from another product would misrepresent the clip. The player
   * falls back to the video's own first frame via `preload="metadata"`.
   *
   * TODO: add `assets/images/brand/shampooing-poster.jpg` (16:9) and set it here.
   */
  readonly poster?: string;
  readonly title: string;
  readonly description: string;
}

export interface ProductDetail {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly categoryLabel: string;
  readonly tagline: string;
  readonly rating: number;
  readonly reviewCount: number;
  readonly currency: string;
  readonly sizes: readonly ProductSize[];
  readonly gallery: readonly GalleryItem[];
  readonly shortDescription: string;
  /** Formulation claims shown beside the buy controls. */
  readonly claims: readonly ProductFeature[];
  /** Wider reassurances shown in the strip below. */
  readonly benefits: readonly ProductFeature[];
  readonly description: readonly string[];
  readonly howToUse: readonly string[];
  readonly ingredients: readonly string[];
  readonly faqs: readonly ProductFaq[];
  readonly video: ProductVideo;
}

// -----------------------------------------------------------------------------
// Glyphs
// -----------------------------------------------------------------------------

const ICON = {
  droplet: ['M12 3.5c3.4 4 5.5 6.7 5.5 9.4a5.5 5.5 0 0 1-11 0c0-2.7 2.1-5.4 5.5-9.4z'],
  leaf: [
    'M20 4c0 8.3-4.2 13-9.5 13A5.5 5.5 0 0 1 5 11.5C5 6.8 11 4 20 4z',
    'M4 20c2.5-4.5 6-7.5 11-9.5',
  ],
  shield: ['M12 3.2 19 6v6c0 4.2-2.9 7.4-7 8.8-4.1-1.4-7-4.6-7-8.8V6z'],
  shieldCheck: [
    'M12 3.2 19 6v6c0 4.2-2.9 7.4-7 8.8-4.1-1.4-7-4.6-7-8.8V6z',
    'M9 12.2l2.1 2.1L15.5 10',
  ],
  rabbit: [
    'M8.5 10.5c-1.2-2.6-1-5.2.6-5.7 1.5-.5 3 1.4 3.4 4',
    'M15.5 10.5c1.2-2.6 1-5.2-.6-5.7-1.5-.5-3 1.4-3.4 4',
    'M6.5 15.5a5.5 5.5 0 0 1 11 0 4 4 0 0 1-4 4h-3a4 4 0 0 1-4-4z',
  ],
  flask: ['M10 3h4v3.4l3.2 5.4a3 3 0 0 1-2.6 4.5H9.4a3 3 0 0 1-2.6-4.5L10 6.4z', 'M8.5 14h7'],
  person: ['M12 4a3.2 3.2 0 1 1 0 6.4A3.2 3.2 0 0 1 12 4z', 'M5.5 20.5a6.5 6.5 0 0 1 13 0'],
  sparkle: [
    'M12 4l1.6 4.4L18 10l-4.4 1.6L12 16l-1.6-4.4L6 10l4.4-1.6z',
    'M18 15l.8 2.2L21 18l-2.2.8L18 21l-.8-2.2L15 18l2.2-.8z',
  ],
  truck: [
    'M3 6.5h11v9H3z',
    'M14 9.5h3.6l2.4 3v3H14z',
    'M7 15.5a1.7 1.7 0 1 1 0 3.4 1.7 1.7 0 0 1 0-3.4z',
    'M17 15.5a1.7 1.7 0 1 1 0 3.4 1.7 1.7 0 0 1 0-3.4z',
  ],
} as const;

// -----------------------------------------------------------------------------
// Content shared by every product
//
// The formulation claims, care instructions and FAQs are brand-wide, so they
// are defined once and merged into each detail record rather than duplicated
// per product.
// -----------------------------------------------------------------------------

const CLAIMS: readonly ProductFeature[] = [
  { id: 'sulfate', title: 'Sulfate', subtitle: 'Free', iconPaths: ICON.droplet },
  { id: 'paraben', title: 'Paraben', subtitle: 'Free', iconPaths: ICON.leaf },
  { id: 'silicone', title: 'Silicone', subtitle: 'Free', iconPaths: ICON.shield },
  { id: 'cruelty', title: 'Cruelty', subtitle: 'Free', iconPaths: ICON.rabbit },
];

const BENEFITS: readonly ProductFeature[] = [
  { id: 'salon', title: 'Salon Professional', subtitle: 'Trusted by Experts', iconPaths: ICON.person },
  { id: 'formulation', title: 'Advanced Formulation', subtitle: 'French Technology', iconPaths: ICON.flask },
  { id: 'safe', title: 'Safe Ingredients', subtitle: 'No Harmful Chemicals', iconPaths: ICON.shieldCheck },
  { id: 'results', title: 'Visible Results', subtitle: 'Loved by Thousands', iconPaths: ICON.sparkle },
];

const TRUST_BADGES: readonly ProductFeature[] = [
  { id: 'authentic', title: '100% Authentic', subtitle: 'Direct from the Lab', iconPaths: ICON.shieldCheck },
  { id: 'salon-only', title: 'Salon Channel', subtitle: 'Authorised Partners', iconPaths: ICON.person },
  { id: 'delivery', title: 'Worldwide Delivery', subtitle: 'Tracked Dispatch', iconPaths: ICON.truck },
];

export const PRODUCT_TRUST_BADGES = TRUST_BADGES;

const HOW_TO_USE: readonly string[] = [
  'Apply to damp hair and work through from root to tip with your fingertips.',
  'Massage gently for one to two minutes to lift residue from the scalp.',
  'Rinse thoroughly with lukewarm water, then repeat if the hair is heavily coated.',
  'Follow with the matching treatment or mask for the full salon result.',
];

const INGREDIENTS: readonly string[] = [
  'Hydrolysed Keratin Amino Acids',
  'Argan (Argania Spinosa) Kernel Oil',
  'Hydrolysed Silk Protein',
  'Panthenol (Pro-Vitamin B5)',
  'Glycerin',
  'Citric Acid',
  'Botanical Extract Blend',
];

const FAQS: readonly ProductFaq[] = [
  {
    id: 'frequency',
    question: 'How often should I use this?',
    answer:
      'Two to three times a week for most hair types, or after every wash for hair ' +
      'that is chemically treated or heavily styled.',
  },
  {
    id: 'colour',
    question: 'Is it safe on coloured or keratin-treated hair?',
    answer:
      'Yes. The formula is sulfate, paraben and silicone free, so it will not strip ' +
      'colour or shorten the life of a keratin or nanoplastia treatment.',
  },
  {
    id: 'results',
    question: 'When will I see results?',
    answer:
      'Most clients see improved smoothness and shine from the first wash, with ' +
      'strength and manageability building over three to four weeks of regular use.',
  },
  {
    id: 'where',
    question: 'Where can I buy it?',
    answer:
      '7 Elements Professional is sold through authorised salon partners only. ' +
      'Contact us and we will connect you with your nearest stockist.',
  },
];

const VIDEO: ProductVideo = {
  src: 'assets/videos/shampooing.mp4',
  title: 'The Professional Wash Ritual',
  description:
    'Watch how our stylists work the formula through the mid-lengths and ends for an ' +
    'even, salon-grade result.',
};

/** Size ladder, priced relative to the listing's headline (500ml) price. */
function buildSizes(basePrice: number): readonly ProductSize[] {
  return [
    { id: '250ml', label: '250ml', price: Math.round((basePrice * 0.6) / 10) * 10, inStock: true },
    { id: '500ml', label: '500ml', price: basePrice, inStock: true },
    { id: '1000ml', label: '1000ml', price: Math.round((basePrice * 1.7) / 10) * 10, inStock: true },
  ];
}

// -----------------------------------------------------------------------------
// Per-product overrides
//
// Only the parts that genuinely differ. Anything absent falls back to the
// shared content above, so every catalogue slug resolves to a full page rather
// than a dead end.
// -----------------------------------------------------------------------------

type DetailOverride = Partial<
  Pick<ProductDetail, 'tagline' | 'shortDescription' | 'description' | 'gallery'>
>;

const OVERRIDES: Readonly<Record<string, DetailOverride>> = {
  'nano-plex-shampoo': {
    tagline: 'Repairs. Strengthens. Restores.',
    shortDescription:
      'A sulfate-free professional cleanser that rebuilds broken bonds while it ' +
      'washes, leaving hair stronger, smoother and visibly glossier.',
    description: [
      'Nano Plex Shampoo is the first step of the Nano Plex System — a salon protocol ' +
        'built around bond repair rather than surface coating.',
      'The nano-scale complex travels into the cortex to reconnect the disulphide ' +
        'bonds broken by colour, heat and chemical services, while a gentle ' +
        'amino-acid cleansing base lifts product residue without stripping.',
      'Because it carries no sulfates, parabens or silicones, it protects keratin and ' +
        'nanoplastia treatments and keeps colour true for longer.',
    ],
    gallery: [
      {
        id: 'front',
        type: 'image',
        src: 'assets/images/products/Product-plex_post_shampoo.png',
        alt: 'Nano Plex Shampoo bottle, front view',
      },
      {
        id: 'alt',
        type: 'image',
        src: 'assets/images/products/Product-plex_pre_shampoo.png',
        alt: 'Nano Plex Shampoo bottle, alternate view',
      },
      {
        id: 'mask',
        type: 'image',
        src: 'assets/images/products/Product-plex_post_mask.png',
        alt: 'Nano Plex Hair Mask, the matching treatment step',
      },
      {
        id: 'range',
        type: 'image',
        src: 'assets/images/collections/nano-plex.png',
        alt: 'The complete Nano Plex System range',
      },
      {
        id: 'video',
        type: 'video',
        src: VIDEO.src,
        alt: 'Video: the professional wash ritual',
      },
    ],
  },
};

/**
 * Builds the full detail record for a catalogue slug.
 *
 * Returns `undefined` for an unknown slug so the page can render a proper
 * not-found state rather than an empty shell.
 */
export function resolveProductDetail(slug: string): ProductDetail | undefined {
  const listing = PRODUCT_LISTINGS.find((product) => product.slug === slug);

  if (!listing) {
    return undefined;
  }

  const override = OVERRIDES[slug] ?? {};

  return {
    id: listing.id,
    slug: listing.slug,
    name: listing.name,
    categoryLabel: listing.categoryLabel,
    tagline: override.tagline ?? `${listing.categoryLabel} · Professional Use`,
    rating: listing.rating,
    reviewCount: listing.reviewCount,
    currency: listing.currency,
    sizes: buildSizes(listing.price),
    gallery: override.gallery ?? defaultGallery(listing),
    shortDescription:
      override.shortDescription ??
      'Salon-grade care formulated for professional results, free from sulfates, ' +
        'parabens and silicones.',
    claims: CLAIMS,
    benefits: BENEFITS,
    description: override.description ?? [
      `${listing.name} is part of the 7 Elements Professional range, developed with ` +
        'advanced French formulation technology for use in salon and at home.',
      'Every formula is free from harsh sulfates, parabens and silicones, so it is ' +
        'safe on coloured, keratin-treated and chemically processed hair.',
    ],
    howToUse: HOW_TO_USE,
    ingredients: INGREDIENTS,
    faqs: FAQS,
    video: VIDEO,
  };
}

/** Single still plus the video, for products without a dedicated shoot. */
function defaultGallery(listing: ProductListing): readonly GalleryItem[] {
  return [
    { id: 'front', type: 'image', src: listing.image, alt: listing.imageAlt },
    { id: 'video', type: 'video', src: VIDEO.src, alt: 'Video: the professional wash ritual' },
  ];
}

/** Products shown in the related carousel — the rest of the catalogue. */
export function relatedProducts(slug: string): readonly ProductListing[] {
  return PRODUCT_LISTINGS.filter((product) => product.slug !== slug).slice(0, 8);
}

export const DETAIL_PROMO = {
  eyebrow: 'Complete The Ritual',
  titleLines: ['Pair It With The', 'Nano Plex Treatment'],
  body: 'Every step of the system is formulated to build on the one before it.',
  ctaLabel: 'Explore The System',
  image: 'assets/images/collections/nano-plex.png',
  imageAlt: 'The complete Nano Plex System range',
} as const;
