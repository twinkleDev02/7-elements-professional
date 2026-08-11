import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { RevealOnScrollDirective } from '@shared/directives/reveal-on-scroll.directive';
import { NavLink } from '@shared/models/nav-link.model';
import { APP_NAME, BRAND_CONTACT, BRAND_LOGO, ROUTES } from '@shared/utils/app.constants';

/** A reassurance shown in the footer's credentials strip. */
export interface FooterAssurance {
  readonly id: string;
  readonly title: string;
  readonly subtitle: string;
  /** Raw SVG `d` values, so the glyph travels with the record. */
  readonly iconPaths: readonly string[];
}

const ASSURANCES: readonly FooterAssurance[] = [
  {
    id: 'premium-quality',
    title: 'Premium Quality',
    subtitle: 'Products',
    iconPaths: ['M12 3.2 19 6v6c0 4.2-2.9 7.4-7 8.8-4.1-1.4-7-4.6-7-8.8V6z'],
  },
  {
    id: 'safe-formulations',
    title: 'Safe & Effective',
    subtitle: 'Formulations',
    iconPaths: [
      'M5 5.5h14v14H5z',
      'M8.6 12.3l2.3 2.3 4.5-4.6',
    ],
  },
  {
    id: 'salon-expert',
    title: 'Salon Expert',
    subtitle: 'Recommended',
    iconPaths: [
      'M12 4a3.2 3.2 0 1 1 0 6.4A3.2 3.2 0 0 1 12 4z',
      'M5.5 20.5a6.5 6.5 0 0 1 13 0',
    ],
  },
  {
    id: 'worldwide-delivery',
    title: 'Worldwide Delivery',
    subtitle: 'Available',
    iconPaths: [
      'M12 3.5a8.5 8.5 0 1 1 0 17 8.5 8.5 0 0 1 0-17z',
      'M3.5 12h17',
      'M12 3.5c2.2 2.4 3.4 5.3 3.4 8.5S14.2 18.1 12 20.5c-2.2-2.4-3.4-5.3-3.4-8.5S9.8 5.9 12 3.5z',
    ],
  },
];

/** One titled column of the footer sitemap. */
export interface FooterColumn {
  readonly id: string;
  readonly title: string;
  readonly links: readonly NavLink[];
}

/** A social account. Rendered only when the list is non-empty. */
export interface FooterSocial {
  readonly id: string;
  readonly label: string;
  readonly href: string;
  /** Raw SVG `d` values, so the glyph travels with the record. */
  readonly iconPaths: readonly string[];
}

/**
 * The sitemap.
 *
 * Every path here resolves to a route that exists. In particular the shop
 * column links individual products rather than ranges: `/products/:slug`
 * matches product slugs only, so a tidy-looking `/products/keratin-range`
 * would land on a detail page with nothing to show.
 */
const FOOTER_COLUMNS: readonly FooterColumn[] = [
  {
    id: 'explore',
    title: 'Explore',
    links: [
      { label: 'Home', path: `/${ROUTES.home}` },
      { label: 'About Us', path: `/${ROUTES.about}` },
      { label: 'All Products', path: `/${ROUTES.products}` },
      { label: 'Contact Us', path: `/${ROUTES.contact}` },
    ],
  },
  {
    id: 'bestsellers',
    title: 'Bestsellers',
    links: [
      { label: 'Nano Plex Shampoo', path: `/${ROUTES.products}/nano-plex-shampoo` },
      { label: 'Keratin Treatment', path: `/${ROUTES.products}/keratin-treatment` },
      { label: 'Argan Hair Mask', path: `/${ROUTES.products}/argan-hair-mask` },
      { label: 'Moroccan Argan Oil', path: `/${ROUTES.products}/moroccan-argan-oil` },
      { label: 'Hair Spa Kit', path: `/${ROUTES.products}/hair-spa-kit` },
    ],
  },
  {
    id: 'partner',
    title: 'Partner With Us',
    links: [
      { label: 'Find A Distributor', path: `/${ROUTES.distributors}` },
      { label: 'Become A Distributor', path: `/${ROUTES.becomeDistributor}` },
    ],
  },
];

/**
 * Empty until the handles are confirmed — the row is skipped rather than
 * shipping icons that link nowhere. Fill this in and it renders itself.
 *
 * TODO: add the brand's Instagram, Facebook and YouTube URLs.
 */
const SOCIAL_LINKS: readonly FooterSocial[] = [];

const LEGAL_LINKS: readonly NavLink[] = [
  { label: 'Privacy Policy', path: '/privacy-policy' },
  { label: 'Terms & Conditions', path: '/terms-and-conditions' },
];

/**
 * Site footer: a credentials strip, the sitemap, then a legal bar.
 *
 * Rendered once by `MainLayout`, so it appears on every route. The newsletter
 * band above it is a home-page section and is composed separately.
 *
 * The entrance is an IntersectionObserver plus CSS transitions rather than
 * GSAP, deliberately: `MainLayout` is eager, so a GSAP import here would put
 * the whole library in the initial bundle for every route — roughly 50 kB
 * transferred, to fade in a footer. The stagger comes from `nth-child`
 * transition delays in the stylesheet.
 */
@Component({
  selector: 'app-footer',
  imports: [RouterLink, RevealOnScrollDirective],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer {
  readonly assurances = input<readonly FooterAssurance[]>(ASSURANCES);
  readonly columns = input<readonly FooterColumn[]>(FOOTER_COLUMNS);
  readonly socialLinks = input<readonly FooterSocial[]>(SOCIAL_LINKS);
  readonly legalLinks = input<readonly NavLink[]>(LEGAL_LINKS);
  readonly blurb = input(
    'Salon-grade haircare crafted from seven elemental actives — formulated ' +
      'for professionals, finished for home.',
  );

  protected readonly brand = APP_NAME;
  protected readonly contact = BRAND_CONTACT;
  protected readonly homeLink = `/${ROUTES.home}`;
  protected readonly logo = BRAND_LOGO;
  protected readonly currentYear = new Date().getFullYear();
}
