/**
 * Content for the About page.
 *
 * Every section takes its list as an input and defaults to the const here, so
 * copy changes never require touching a template, and a CMS can replace this
 * file wholesale later.
 *
 * `iconPaths` holds raw SVG `d` values: the glyph travels with the record
 * instead of forcing a `@switch` ladder into each template.
 */

/** An icon paired with a two-line label — the page's most repeated unit. */
export interface AboutFeature {
  readonly id: string;
  readonly title: string;
  readonly subtitle: string;
  readonly iconPaths: readonly string[];
}

export interface AboutStat {
  readonly id: string;
  /** Numeric part, counted up when the panel enters the viewport. */
  readonly value: number;
  /** Rendered after the counted value, e.g. `K+` or `+`. */
  readonly suffix: string;
  readonly label: string;
  readonly caption: string;
  readonly iconPaths: readonly string[];
}

export interface AboutCollection {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  /** Benefit lines, rendered one per row under the title. */
  readonly benefits: readonly string[];
  readonly image: string;
  readonly imageAlt: string;
}

export interface MissionPillar {
  readonly id: string;
  readonly title: string;
  readonly body: string;
  readonly iconPaths: readonly string[];
}

// -----------------------------------------------------------------------------
// Shared glyphs, so the same idea is never drawn two different ways.
// -----------------------------------------------------------------------------

const ICON = {
  leaf: [
    'M20 4c0 8.3-4.2 13-9.5 13A5.5 5.5 0 0 1 5 11.5C5 6.8 11 4 20 4z',
    'M4 20c2.5-4.5 6-7.5 11-9.5',
  ],
  flask: ['M10 3h4v3.4l3.2 5.4a3 3 0 0 1-2.6 4.5H9.4a3 3 0 0 1-2.6-4.5L10 6.4z', 'M8.5 14h7'],
  droplet: ['M12 3.5c3.4 4 5.5 6.7 5.5 9.4a5.5 5.5 0 0 1-11 0c0-2.7 2.1-5.4 5.5-9.4z'],
  shield: ['M12 3.2 19 6v6c0 4.2-2.9 7.4-7 8.8-4.1-1.4-7-4.6-7-8.8V6z'],
  shieldCheck: [
    'M12 3.2 19 6v6c0 4.2-2.9 7.4-7 8.8-4.1-1.4-7-4.6-7-8.8V6z',
    'M9 12.2l2.1 2.1L15.5 10',
  ],
  bottle: ['M9.5 3h5v2.6l2 2.4v11a2 2 0 0 1-2 2h-5a2 2 0 0 1-2-2v-11l2-2.4z', 'M8 12h8'],
  rabbit: [
    'M8.5 10.5c-1.2-2.6-1-5.2.6-5.7 1.5-.5 3 1.4 3.4 4',
    'M15.5 10.5c1.2-2.6 1-5.2-.6-5.7-1.5-.5-3 1.4-3.4 4',
    'M6.5 15.5a5.5 5.5 0 0 1 11 0 4 4 0 0 1-4 4h-3a4 4 0 0 1-4-4z',
  ],
  person: ['M12 4a3.2 3.2 0 1 1 0 6.4A3.2 3.2 0 0 1 12 4z', 'M5.5 20.5a6.5 6.5 0 0 1 13 0'],
  globe: [
    'M12 3.5a8.5 8.5 0 1 1 0 17 8.5 8.5 0 0 1 0-17z',
    'M3.5 12h17',
    'M12 3.5c2.2 2.4 3.4 5.3 3.4 8.5S14.2 18.1 12 20.5c-2.2-2.4-3.4-5.3-3.4-8.5S9.8 5.9 12 3.5z',
  ],
  root: ['M12 3.5v9', 'M12 12.5c0 4-2 6-5 8', 'M12 12.5c0 4 2 6 5 8', 'M9 7.5 12 5l3 2.5'],
  strands: ['M8.5 4c-2 4-2 12 0 16', 'M12 4c-2 4-2 12 0 16', 'M15.5 4c-2 4-2 12 0 16'],
  sparkle: [
    'M12 4l1.6 4.4L18 10l-4.4 1.6L12 16l-1.6-4.4L6 10l4.4-1.6z',
    'M18 15l.8 2.2L21 18l-2.2.8L18 21l-.8-2.2L15 18l2.2-.8z',
  ],
  laurel: [
    'M12 4.5a7.5 7.5 0 0 1 0 15 7.5 7.5 0 0 1 0-15z',
    'M9.6 12l1.7 1.7 3.3-3.4',
  ],
  cluster: [
    'M8 9.5a2.4 2.4 0 1 1 0 4.8 2.4 2.4 0 0 1 0-4.8z',
    'M16 9.5a2.4 2.4 0 1 1 0 4.8 2.4 2.4 0 0 1 0-4.8z',
    'M12 14.5a2.4 2.4 0 1 1 0 4.8 2.4 2.4 0 0 1 0-4.8z',
    'M12 4.5a2.4 2.4 0 1 1 0 4.8 2.4 2.4 0 0 1 0-4.8z',
  ],
  target: [
    'M12 3.5a8.5 8.5 0 1 1 0 17 8.5 8.5 0 0 1 0-17z',
    'M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8z',
    'M12 11.2a.8.8 0 1 1 0 1.6.8.8 0 0 1 0-1.6z',
  ],
  eye: ['M2.8 12S6.5 5.8 12 5.8 21.2 12 21.2 12 17.5 18.2 12 18.2 2.8 12 2.8 12z', 'M12 9.2a2.8 2.8 0 1 1 0 5.6 2.8 2.8 0 0 1 0-5.6z'],
  certificate: [
    'M12 3.5a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11z',
    'M8.5 13.5 7 21l5-2.4L17 21l-1.5-7.5',
  ],
  ban: ['M12 4.2a7.8 7.8 0 1 1 0 15.6 7.8 7.8 0 0 1 0-15.6z', 'M6.5 6.5l11 11'],
} as const;

// -----------------------------------------------------------------------------
// Hero
// -----------------------------------------------------------------------------

export const ABOUT_HERO = {
  eyebrow: 'About 7 Elements Professional',
  titleLines: ['Crafting Beautiful', 'Hair Since Day One'],
  tagline: 'Pure • Professional • Premium',
  body:
    '7 Elements Professional was created for professional hairstylists by expert ' +
    'formulators dedicated to salon-quality hair care.',
  ctaLabel: 'Explore Our Collection',
  // TODO: verify this is the podium/peony frame from the reference. If a
  // dedicated About hero render exists, drop it in and update this path.
  image: 'assets/images/brand/about_banner.png',
  imageAlt: '7 Elements Professional products arranged on a gold podium with peonies',
} as const;

// -----------------------------------------------------------------------------
// Our story
// -----------------------------------------------------------------------------

export const ABOUT_STORY = {
  eyebrow: 'Our Story',
  title: 'Science Behind Beautiful Hair',
  paragraphs: [
    'Crafted with carefully selected ingredients, our formulas are free from harsh ' +
      'sulfates, silicones, and other harmful chemicals.',
    'Developed using advanced technology and exceptional formulation expertise, our ' +
      'products help nourish, strengthen, and transform your hair, leaving it smooth, ' +
      'healthy, and beautifully lustrous with every use.',
  ],
  badgeValue: '18+',
  badgeLabel: 'Years Of Experience',
  image: 'assets/images/brand/product_page.png',
  imageAlt: 'Model with long, lustrous waves after a professional salon treatment',
} as const;

export const STORY_FEATURES: readonly AboutFeature[] = [
  { id: 'salon-quality', title: 'Salon Quality', subtitle: 'Professional Grade', iconPaths: ICON.person },
  { id: 'safe-effective', title: 'Safe & Effective', subtitle: 'Dermatologically Tested', iconPaths: ICON.bottle },
  { id: 'advanced-technology', title: 'Advanced Technology', subtitle: 'Visible Results', iconPaths: ICON.flask },
  { id: 'chemical-free', title: 'Chemical Free', subtitle: 'Sulfate • Paraben • Silicone', iconPaths: ICON.droplet },
  { id: 'carefully-selected', title: 'Carefully Selected', subtitle: 'Natural Ingredients', iconPaths: ICON.leaf },
  { id: 'cruelty-free', title: 'Cruelty Free', subtitle: 'We Never Test On Animals', iconPaths: ICON.rabbit },
];

// -----------------------------------------------------------------------------
// Brand film
//
// Placed after Our Story: the narrative is told in prose, then shown.
// -----------------------------------------------------------------------------

export const ABOUT_FILM = {
  eyebrow: 'Inside The Brand',
  title: 'The 7 Elements Experience',
  description:
    'A closer look at the formulations, the finish they deliver, and the professionals ' +
    'who work with them every day.',
  src: 'assets/videos/add.mp4',
  aspectRatio: '16 / 9',
} as const;

// -----------------------------------------------------------------------------
// Philosophy
// -----------------------------------------------------------------------------

export const ABOUT_PHILOSOPHY = {
  eyebrow: 'Our Philosophy',
  body:
    'Caring for your hair and scalp may seem like two separate things, but they are ' +
    'deeply connected because healthy hair begins beneath the skin.',
} as const;

export const PHILOSOPHY_PILLARS: readonly AboutFeature[] = [
  { id: 'scalp', title: 'Healthy Scalp', subtitle: 'Strong Roots', iconPaths: ICON.root },
  { id: 'hair', title: 'Nourished Hair', subtitle: 'Beautiful You', iconPaths: ICON.strands },
  { id: 'confidence', title: 'Confidence In', subtitle: 'Every Strand', iconPaths: ICON.sparkle },
];

// -----------------------------------------------------------------------------
// Statistics
// -----------------------------------------------------------------------------

export const ABOUT_STATS: readonly AboutStat[] = [
  {
    id: 'experience',
    value: 18,
    suffix: '+',
    label: 'Years Of Experience',
    caption: 'In Professional Hair Care',
    iconPaths: ICON.laurel,
  },
  {
    id: 'products',
    value: 50,
    suffix: '+',
    label: 'Premium Products',
    caption: 'Across Multiple Categories',
    iconPaths: ICON.bottle,
  },
  {
    id: 'customers',
    value: 500,
    suffix: 'K+',
    label: 'Happy Customers',
    caption: 'Trust Our Products',
    iconPaths: ICON.cluster,
  },
  {
    id: 'countries',
    value: 25,
    suffix: '+',
    label: 'Countries Served',
    caption: 'Worldwide Presence',
    iconPaths: ICON.globe,
  },
];

// -----------------------------------------------------------------------------
// The 7 Elements Promise
// -----------------------------------------------------------------------------

export const ABOUT_PROMISE = {
  eyebrow: 'Why Choose 7 Elements Professional?',
  title: 'The 7 Elements Promise',
} as const;

export const PROMISE_ITEMS: readonly AboutFeature[] = [
  { id: 'salon', title: 'Professional', subtitle: 'Salon Quality', iconPaths: ICON.leaf },
  { id: 'formulation', title: 'Advanced', subtitle: 'Formulation', iconPaths: ICON.flask },
  { id: 'natural', title: 'Natural', subtitle: 'Ingredients', iconPaths: ICON.leaf },
  { id: 'lasting', title: 'Long Lasting', subtitle: 'Results', iconPaths: ICON.droplet },
  { id: 'tested', title: 'Safe & Dermatologically', subtitle: 'Tested', iconPaths: ICON.shield },
  { id: 'free-from', title: 'Sulfate Paraben', subtitle: 'Silicone Free', iconPaths: ICON.rabbit },
  { id: 'eco', title: 'Cruelty Free &', subtitle: 'Eco Conscious', iconPaths: ICON.rabbit },
];

// -----------------------------------------------------------------------------
// Professional collections
// -----------------------------------------------------------------------------

export const ABOUT_COLLECTIONS_EYEBROW = 'Our Professional Collections';

export const ABOUT_COLLECTIONS: readonly AboutCollection[] = [
  {
    id: 'nano-plex',
    slug: 'nano-plex-system',
    title: 'Nano Plex System',
    benefits: ['Repair • Restore', 'Strengthen'],
    image: 'assets/images/collections/nano-plex.png',
    imageAlt: 'Nano Plex System shampoo, treatment and mask',
  },
  {
    id: 'keratin',
    slug: 'keratin-range',
    title: 'Keratin Range',
    benefits: ['Smooth • Shine', 'Frizz Control'],
    image: 'assets/images/collections/keration_smooth.png',
    imageAlt: 'Keratin Range shampoo and smoothing lotion',
  },
  {
    id: 'nanoplastia',
    slug: 'nanoplastia-treatment',
    title: 'Nanoplastia Treatment',
    benefits: ['Straight • Smooth', 'Long Lasting'],
    image: 'assets/images/collections/nano-plastia.png',
    imageAlt: 'Nanoplastia professional salon treatment',
  },
  {
    id: 'argan',
    slug: 'argan-series',
    title: 'Argan Series',
    benefits: ['Nourish • Hydrate', 'Revitalize'],
    image: 'assets/images/collections/argan_oil.png',
    imageAlt: 'Argan Series Moroccan argan oil',
  },
  {
    id: 'hair-spa',
    slug: 'hair-spa-range',
    title: 'Hair Spa Range',
    benefits: ['Deep Care • Scalp Care', 'Luxury Experience'],
    image: 'assets/images/collections/hydera_spa.png',
    imageAlt: 'Hair Spa Range treatment',
  },
  {
    id: 'luxury',
    slug: 'luxury-hair-care',
    title: 'Luxury Hair Care',
    benefits: ['Serum • Argan Oil', 'Daily Nourishment'],
    image: 'assets/images/collections/hair_serum.png',
    imageAlt: 'Luxury Hair Care serum and argan oil',
  },
];

// -----------------------------------------------------------------------------
// Mission and vision
// -----------------------------------------------------------------------------

export const MISSION_VISION: readonly MissionPillar[] = [
  {
    id: 'mission',
    title: 'Our Mission',
    body:
      'To deliver safe, effective and luxurious beauty products that enhance natural ' +
      'beauty and promote self-confidence.',
    iconPaths: ICON.target,
  },
  {
    id: 'vision',
    title: 'Our Vision',
    body:
      'To be a global leader in professional hair care, setting new standards for ' +
      'quality, innovation and sustainability.',
    iconPaths: ICON.eye,
  },
];

// TODO: verify this is the bottle-and-jar-with-foliage still from the reference.
export const MISSION_IMAGE = {
  src: 'assets/images/collections/hair_serum.png',
  alt: '7 Elements Professional serum and treatment jar with foliage',
} as const;

// -----------------------------------------------------------------------------
// Certifications
// -----------------------------------------------------------------------------

export const ABOUT_CERTIFICATIONS_EYEBROW = 'Certified Quality You Can Trust';

export const ABOUT_CERTIFICATIONS: readonly AboutFeature[] = [
  { id: 'gmp', title: 'GMP', subtitle: 'Certified', iconPaths: ICON.certificate },
  { id: 'iso', title: 'ISO', subtitle: 'Certified', iconPaths: ICON.certificate },
  { id: 'paraben', title: 'Paraben', subtitle: 'Free', iconPaths: ICON.leaf },
  { id: 'sulfate', title: 'Sulfate', subtitle: 'Free', iconPaths: ICON.ban },
  { id: 'silicone', title: 'Silicone', subtitle: 'Free', iconPaths: ICON.droplet },
  { id: 'cruelty', title: 'Cruelty', subtitle: 'Free', iconPaths: ICON.rabbit },
];

export const FRENCH_FORMULATION = {
  title: 'French Formulation',
  body:
    'Expertly developed with advanced French technology for superior performance and ' +
    'salon results.',
} as const;

// -----------------------------------------------------------------------------
// Final call to action
// -----------------------------------------------------------------------------

export const ABOUT_CTA = {
  titleLines: ["Let's Begin Your", 'Hair Transformation'],
  body:
    'Experience the power of 7 Elements Professional and reveal the best version of ' +
    'your hair.',
  ctaLabel: 'Explore Products',
} as const;

export const CTA_ASSURANCES: readonly AboutFeature[] = [
  { id: 'salon-trusted', title: 'Salon Trusted', subtitle: 'Professional Choice', iconPaths: ICON.person },
  { id: 'premium', title: 'Premium Quality', subtitle: 'Visible Results', iconPaths: ICON.shieldCheck },
  { id: 'safe-pure', title: 'Safe & Pure', subtitle: 'Natural Care', iconPaths: ICON.leaf },
];
