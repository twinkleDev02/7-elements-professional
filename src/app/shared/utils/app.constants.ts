import { NavLink } from '@shared/models/nav-link.model';

export const APP_NAME = '7 Elements Professional';

/**
 * The brand lockup.
 *
 * One constant for every appearance — header, footer, share card — so the mark
 * can never end up pointing at three different files. The artwork carries the
 * full lockup, wordmark and all, which is why the places that use it render the
 * image *instead of* the typeset name rather than beside it.
 */
export const BRAND_LOGO = 'assets/images/brand/logo.png';

/** Fallbacks used by `SeoService` whenever a route omits its own metadata. */
export const DEFAULT_ROUTE_META = {
  title: `${APP_NAME} — Luxury Professional Haircare`,
  description:
    'Salon-grade haircare crafted from seven elemental actives. Discover the ' +
    '7 Elements Professional collection.',
  // Was `assets/images/og-default.jpg`, which is not in the repository — so
  // every share card asked for a file that 404s. The lockup is a real file and
  // the right mark for the job.
  image: BRAND_LOGO,
} as const;

/** Canonical route paths. Import these instead of typing string literals. */
export const ROUTES = {
  home: '',
  about: 'about',
  products: 'products',
  distributors: 'distributors',
  becomeDistributor: 'become-a-distributor',
  contact: 'contact',
} as const;

/**
 * The brand's public contact points, shared by the footer and the contact page
 * so a number is never corrected in one place and left stale in the other.
 *
 * !! PLACEHOLDER VALUES !! The catalogue publishes no phone number or street
 * address. The number is deliberately `00000 00000` so it cannot be mistaken
 * for a real one; replace these before launch.
 */
export const BRAND_CONTACT = {
  company: 'Redefining Salon Artistry Pvt. Ltd.',
  phone: '+91 00000 00000',
  phoneHref: 'tel:+910000000000',
  email: 'hello@7elementsprofessional.com',
  emailHref: 'mailto:hello@7elementsprofessional.com',
  hours: 'Mon – Sat, 10:00 – 19:00 IST',
} as const;

/** Primary navigation, shared by the navbar and the footer sitemap. */
export const PRIMARY_NAV: readonly NavLink[] = [
  { label: 'Home', path: `/${ROUTES.home}` },
  { label: 'About', path: `/${ROUTES.about}` },
  { label: 'Products', path: `/${ROUTES.products}` },
  { label: 'Contact', path: `/${ROUTES.contact}` },
] as const;

/** Prefix for every `StorageService` key, so the namespace stays collision-free. */
export const STORAGE_PREFIX = '7ep';

/** Debounce applied to search and other type-ahead inputs, in milliseconds. */
export const INPUT_DEBOUNCE_MS = 300;
