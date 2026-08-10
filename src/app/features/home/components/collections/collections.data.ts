/**
 * Collections shown in the home carousel.
 *
 * Kept as structured data rather than markup so the section supports any number
 * of entries — add an object here and the carousel picks it up, no template
 * change. Swap this const for an API response when the backend exists; the
 * component takes the list as an input and defaults to this.
 *
 * `iconPaths` holds raw SVG `d` values so the badge glyph travels with the
 * record instead of forcing a `@switch` ladder in the template.
 */
export interface CollectionCardData {
  readonly id: string;
  /** URL segment appended to the products route. */
  readonly slug: string;
  readonly title: string;
  /** Short benefit line under the title. */
  readonly tagline: string;
  readonly image: string;
  /** Describes the products shown, for anyone who cannot see the photograph. */
  readonly imageAlt: string;
  readonly iconPaths: readonly string[];
}

const IMAGE_BASE = 'assets/images/collections';

export const HOME_COLLECTIONS: readonly CollectionCardData[] = [
  {
    id: 'nano-plex',
    slug: 'nano-plex-system',
    title: 'Nano Plex System',
    tagline: 'Repairs. Strengthens. Restores.',
    image: `${IMAGE_BASE}/nano-plex.png`,
    imageAlt: 'Nano Plex shampoo, treatment and mask bottles',
    iconPaths: ['M12 3.5c3.4 4 5.5 6.7 5.5 9.4a5.5 5.5 0 0 1-11 0c0-2.7 2.1-5.4 5.5-9.4z', 'M9.6 13.4a2.6 2.6 0 0 0 2.6 2.6'],
  },
  {
    id: 'keratin',
    slug: 'keratin-range',
    title: 'Keratin Range',
    tagline: 'Smooth. Shine. Frizz Control.',
    image: `${IMAGE_BASE}/keration_smooth.png`,
    imageAlt: 'Keratin shampoo and smoothing lotion bottles',
    iconPaths: ['M4 8.5c3-3 5-3 8 0s5 3 8 0', 'M4 13c3-3 5-3 8 0s5 3 8 0', 'M4 17.5c3-3 5-3 8 0s5 3 8 0'],
  },
  {
    id: 'luxury-hair-care',
    slug: 'luxury-hair-care',
    title: 'Luxury Hair Care',
    tagline: 'Nourish. Protect. Enhance.',
    image: `${IMAGE_BASE}/hair_serum.png`,
    imageAlt: 'Keratin infusion hair serum with dropper',
    iconPaths: ['M10 3h4v3.4l3.2 5.4a3 3 0 0 1-2.6 4.5H9.4a3 3 0 0 1-2.6-4.5L10 6.4z', 'M12 20.5v-1.6'],
  },
  {
    id: 'hair-treatments',
    slug: 'hair-treatments',
    title: 'Hair Treatments',
    tagline: 'Professional Spa & Deep Care.',
    image: `${IMAGE_BASE}/nano-plastia.png`,
    imageAlt: 'Nanoplastia professional salon treatment bottles',
    iconPaths: ['M12 20c-4.4 0-8-3.1-8-7 4.4 0 8 3.1 8 7z', 'M12 20c4.4 0 8-3.1 8-7-4.4 0-8 3.1-8 7z', 'M12 20V9.5', 'M12 9.5c0-3 1.4-5 3-6.5-2.6.3-4.4 2-5 4'],
  },
  {
    id: 'hair-essentials',
    slug: 'hair-essentials',
    title: 'Hair Essentials',
    tagline: 'Daily Care, Beautiful Hair.',
    image: `${IMAGE_BASE}/argan_oil.png`,
    imageAlt: 'Moroccan argan oil bottle',
    iconPaths: ['M9.5 3h5v2.6l2 2.4v11a2 2 0 0 1-2 2h-5a2 2 0 0 1-2-2v-11l2-2.4z', 'M8 12h8'],
  },
  {
    id: 'argan-series',
    slug: 'argan-series',
    title: 'Argan Series',
    tagline: 'Moisture. Repair. Radiance.',
    image: `${IMAGE_BASE}/argan_oil_sharpoo_and_mask.png`,
    imageAlt: 'Argan shampoo and hair mask',
    iconPaths: ['M20 4c0 8.3-4.2 13-9.5 13A5.5 5.5 0 0 1 5 11.5C5 6.8 11 4 20 4z', 'M4 20c2.5-4.5 6-7.5 11-9.5'],
  },
  {
    id: 'korean-hydra-spa',
    slug: 'korean-hydra-spa',
    title: 'Korean Hydra Spa',
    tagline: 'Deep Hydration. Glass Shine.',
    image: `${IMAGE_BASE}/hydera_spa.png`,
    imageAlt: 'Korean Hydra Spa hair treatment',
    iconPaths: ['M8 4.5c2.2 2.6 3.5 4.4 3.5 6.1a3.5 3.5 0 0 1-7 0c0-1.7 1.3-3.5 3.5-6.1z', 'M16.5 11c1.8 2.2 2.9 3.7 2.9 5.1a2.9 2.9 0 0 1-5.8 0c0-1.4 1.1-2.9 2.9-5.1z'],
  },
  {
    id: 'coffee-hair-spa',
    slug: 'coffee-hair-spa',
    title: 'Coffee Hair Spa',
    tagline: 'Nourish. Revive. Strengthen.',
    image: `${IMAGE_BASE}/coffee_hair_spa.png`,
    imageAlt: 'Coffee extract hair spa treatment',
    iconPaths: ['M4.5 7.5h11v6a4 4 0 0 1-4 4h-3a4 4 0 0 1-4-4z', 'M15.5 9.5h1.8a2.6 2.6 0 0 1 0 5.2h-1.8', 'M6.5 3.5v2M10 3v2.5M13.5 3.5v2'],
  },
  {
    id: 'brazilian-hair-spa',
    slug: 'brazilian-hair-spa',
    title: 'Brazilian Hair Spa',
    tagline: 'Repair. Smooth. Protect.',
    image: `${IMAGE_BASE}/brazilian_hair_spa.png`,
    imageAlt: 'Brazilian hair spa with Australian nut',
    iconPaths: ['M12 4a8 8 0 1 1 0 16 8 8 0 0 1 0-16z', 'M12 4c-2.4 2.6-3.6 5.2-3.6 8s1.2 5.4 3.6 8', 'M12 4c2.4 2.6 3.6 5.2 3.6 8s-1.2 5.4-3.6 8'],
  },
  {
    id: 'shea-butter',
    slug: 'shea-butter-mask',
    title: 'Shea Butter Mask',
    tagline: 'Growth. Softness. Repair.',
    image: `${IMAGE_BASE}/shea_butter.png`,
    imageAlt: 'Shea butter hair mask jar',
    iconPaths: ['M12 4.5c1.7 0 2.8 1.3 2.8 2.9 1.4-.8 3.1-.3 3.9 1.1s.3 3.1-1.1 3.9c1.4.8 1.9 2.5 1.1 3.9s-2.5 1.9-3.9 1.1c0 1.6-1.1 2.9-2.8 2.9s-2.8-1.3-2.8-2.9c-1.4.8-3.1.3-3.9-1.1s-.3-3.1 1.1-3.9c-1.4-.8-1.9-2.5-1.1-3.9s2.5-1.9 3.9-1.1c0-1.6 1.1-2.9 2.8-2.9z', 'M12 10.2a1.8 1.8 0 1 1 0 3.6 1.8 1.8 0 0 1 0-3.6z'],
  },
];
