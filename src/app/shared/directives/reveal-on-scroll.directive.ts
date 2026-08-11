import {
  DestroyRef,
  Directive,
  ElementRef,
  afterNextRender,
  inject,
  input,
  output,
  signal,
} from '@angular/core';

import { SCROLL_TRIGGER_THRESHOLD } from '@shared/animations/animation.tokens';
import { isBrowser, prefersReducedMotion } from '@shared/utils/platform.util';

/**
 * Adds a class to the host the first time it scrolls into view, and emits so a
 * component can kick off a GSAP timeline at the same moment.
 *
 * ```html
 * <section appRevealOnScroll (revealed)="playIntro()">…</section>
 * ```
 *
 * The class is applied immediately — without waiting for the observer — when
 * the visitor prefers reduced motion, so content is never left hidden.
 */
@Directive({
  selector: '[appRevealOnScroll]',
  host: {
    '[class.is-revealed]': 'hasRevealed()',
  },
})
export class RevealOnScrollDirective {
  private readonly host = inject(ElementRef<HTMLElement>);

  /** Fraction of the element that must be visible before revealing. */
  readonly threshold = input(SCROLL_TRIGGER_THRESHOLD);
  /** Shrinks the viewport rect, e.g. `'0px 0px -10% 0px'` to reveal early. */
  readonly rootMargin = input('0px');

  readonly revealed = output<void>();

  /**
   * A signal, not a plain field: the observer fires outside anything Angular
   * watches, so on an `OnPush` host a plain field left the class binding
   * unevaluated until some later event happened to run change detection — the
   * section stayed hidden until the visitor clicked something.
   */
  protected readonly hasRevealed = signal(false);

  constructor() {
    if (!isBrowser()) {
      return;
    }

    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      if (prefersReducedMotion() || typeof IntersectionObserver === 'undefined') {
        this.reveal();
        return;
      }

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) {
            return;
          }

          if (entry.intersectionRatio >= this.threshold() || !this.thresholdIsReachable(entry)) {
            this.reveal();
            observer.disconnect();
          }
        },
        // `0` as well as the requested threshold, so the callback still runs
        // for an element that can never reach the latter — see below.
        { threshold: [0, this.threshold()], rootMargin: this.rootMargin() },
      );

      observer.observe(this.host.nativeElement);
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }

  /**
   * Whether this element could ever be `threshold` visible.
   *
   * A threshold is a fraction of the *element*, not of the screen, so an
   * element taller than the viewport can never reach a high one: the products
   * grid is a single 5,200px column on a phone, of which at most 16% is on
   * screen at once, and it sat behind a 20% threshold that could not fire. The
   * cards stayed at `opacity: 0` for ever and read as though they were still
   * loading.
   *
   * Where the bar is unreachable it is the bar that is wrong, so any
   * intersection at all counts instead. Elements that *can* satisfy it still
   * wait for it, which keeps the reveal timing everywhere else unchanged.
   */
  private thresholdIsReachable(entry: IntersectionObserverEntry): boolean {
    const elementHeight = entry.boundingClientRect.height;
    const viewportHeight = entry.rootBounds?.height ?? window.innerHeight;

    if (elementHeight <= 0) {
      return true;
    }

    return viewportHeight / elementHeight >= this.threshold();
  }

  private reveal(): void {
    if (this.hasRevealed()) {
      return;
    }

    this.hasRevealed.set(true);
    this.revealed.emit();
  }
}
