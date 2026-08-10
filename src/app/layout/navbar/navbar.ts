import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  afterNextRender,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { NavLink } from '@shared/models/nav-link.model';
import { ROUTES } from '@shared/utils/app.constants';
import { isBrowser } from '@shared/utils/platform.util';

/** A top-level nav entry, optionally with a submenu of child links. */
export interface HeaderLink extends NavLink {
  readonly children?: readonly NavLink[];
}

const DISTRIBUTOR_LINKS: readonly NavLink[] = [
  { label: 'Find A Distributor', path: `/${ROUTES.distributors}` },
  { label: 'Become A Distributor', path: `/${ROUTES.becomeDistributor}` },
];

/**
 * Every entry here resolves to a page that exists. `Collections` and
 * `Professional` were removed rather than left pointing at Products and About —
 * a nav item that lands somewhere other than its label promises is worse than
 * no nav item. Add them back when those pages are built.
 *
 * Every item navigates on the first click, submenu or not. Products goes
 * straight to the full catalogue rather than fanning out into ranges, which
 * put a menu between the shopper and the page they were already asking for.
 */
const HEADER_NAV: readonly HeaderLink[] = [
  { label: 'Home', path: `/${ROUTES.home}` },
  { label: 'About Us', path: `/${ROUTES.about}` },
  { label: 'Products', path: `/${ROUTES.products}` },
  { label: 'Distributors', path: `/${ROUTES.distributors}`, children: DISTRIBUTOR_LINKS },
  { label: 'Contact Us', path: `/${ROUTES.contact}` },
];

/** Scroll distance, in px, after which the header condenses. */
const CONDENSE_AFTER = 24;

/**
 * Site header: wordmark, primary navigation and the quote button on one row.
 *
 * Sticky, and condenses once the page leaves the top. Deliberately free of
 * GSAP — the header renders on every route through `MainLayout`, and importing
 * the animation library here would put it in the initial bundle site-wide. The
 * entrance and condense states are CSS transitions.
 */
@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Navbar {
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  readonly links = input<readonly HeaderLink[]>(HEADER_NAV);
  readonly quoteLabel = input('Get a Quote');

  protected readonly homeLink = `/${ROUTES.home}`;
  protected readonly quoteLink = `/${ROUTES.contact}`;

  /** Mobile drawer state. */
  protected readonly isMenuOpen = signal(false);
  /** True once the page has scrolled, which tightens the header. */
  protected readonly isCondensed = signal(false);
  /** Plays the one-time entrance once the component has rendered. */
  protected readonly hasEntered = signal(false);

  constructor() {
    // Locking the page behind an open drawer is a side effect of the state,
    // not of the click that caused it — so it belongs here, where it cannot be
    // missed by a new way of closing the menu.
    effect(() => {
      const locked = this.isMenuOpen();
      this.document.body.classList.toggle('is-scroll-locked', locked);
    });

    this.destroyRef.onDestroy(() => {
      this.document.body.classList.remove('is-scroll-locked');
    });

    if (!isBrowser()) {
      return;
    }

    afterNextRender(() => {
      this.hasEntered.set(true);

      const onScroll = () => {
        this.isCondensed.set(window.scrollY > CONDENSE_AFTER);
      };

      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
      this.destroyRef.onDestroy(() => window.removeEventListener('scroll', onScroll));
    });
  }

  protected toggleMenu(): void {
    this.isMenuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  /** Escape closes the drawer. */
  protected onEscape(): void {
    this.closeMenu();
  }
}
