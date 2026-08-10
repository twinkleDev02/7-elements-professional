import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { gsap } from 'gsap';

import { ROUTES } from '@shared/utils/app.constants';
import { isBrowser, prefersReducedMotion } from '@shared/utils/platform.util';

/**
 * Where the hero earns its entrance.
 *
 * Mirrors the stylesheet's `lg`. Phones pay the most for motion and gain the
 * least from it, so below this width the hero simply renders as authored.
 */
const MOTION_QUERY = '(min-width: 64rem)';

/** True when the viewport is wide enough for the hero's entrance. */
function motionIsWelcome(): boolean {
  return window.matchMedia(MOTION_QUERY).matches;
}

/**
 * Home hero.
 *
 * The artwork is the section's CSS background rather than an `<img>`: it is a
 * flattened composite that carries no information the copy does not, so it is
 * decoration, and decoration belongs in the stylesheet.
 *
 * ## What is deliberately absent
 *
 * This used to be a pinned, scroll-scrubbed sequence — the composite scaled
 * from an origin parked over the bottle cluster, six layers drifting at their
 * own rates, driven through Lenis so the scrub and the scroll advanced on one
 * frame. All of it is gone, along with Lenis itself: with nothing scrubbed
 * there is nothing to synchronise, and smooth-scroll is a page-level concern
 * that should not be installed by a section. The hero now holds still and the
 * page scrolls past it natively.
 *
 * What remains is a one-shot entrance on load, desktop only. Every tween is a
 * `from()`, so the markup is authored in its final state: with JavaScript off,
 * on a phone, or under `prefers-reduced-motion`, the hero renders complete.
 */
@Component({
  selector: 'app-hero',
  imports: [RouterLink],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroComponent {
  private readonly host = inject(ElementRef<HTMLElement>).nativeElement as HTMLElement;
  private readonly destroyRef = inject(DestroyRef);

  protected readonly collectionLink = `/${ROUTES.products}`;
  protected readonly storyLink = `/${ROUTES.about}`;

  constructor() {
    if (!isBrowser()) {
      return;
    }

    afterNextRender(() => {
      if (prefersReducedMotion() || !motionIsWelcome()) {
        return;
      }

      const context = gsap.context((self) => {
        this.playEntrance(self.selector as gsap.utils.SelectorFunc);
      }, this.host);

      this.destroyRef.onDestroy(() => context.revert());
    });
  }

  /** Staged reveal, roughly 1.8s end to end. Runs once, on load. */
  private playEntrance(q: gsap.utils.SelectorFunc): void {
    gsap
      .timeline({ defaults: { ease: 'power3.out', duration: 0.9 } })
      // One fade on the wrapper for the entire visual: the glow and the
      // background both belong to `.hero__media`, so fading it reveals them
      // together and leaves their own opacity untouched.
      .from(q('.hero__media'), { opacity: 0, duration: 1.1, ease: 'power1.out' }, 0)
      .from(q('.hero__eyebrow'), { autoAlpha: 0, y: 18 }, 0.5)
      // Masked lines, so each wipes up from behind the one above it.
      .from(q('.hero__title-line'), { yPercent: 115, autoAlpha: 0, stagger: 0.1 }, 0.7)
      .from(q('.hero__subtitle'), { autoAlpha: 0, y: 22 }, 0.9)
      .from(q('.hero__cta'), { autoAlpha: 0, y: 20, scale: 0.95, stagger: 0.09 }, 1.1)
      .from(q('.hero__claim'), { autoAlpha: 0, y: 14, stagger: 0.06, duration: 0.6 }, 1.2)
      .from(q('.hero__feature'), { autoAlpha: 0, y: 26, stagger: 0.08, duration: 0.7 }, 1.3);
  }
}
