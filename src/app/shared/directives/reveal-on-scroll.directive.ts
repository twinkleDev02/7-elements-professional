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
          if (entry.isIntersecting) {
            this.reveal();
            observer.disconnect();
          }
        },
        { threshold: this.threshold(), rootMargin: this.rootMargin() },
      );

      observer.observe(this.host.nativeElement);
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }

  private reveal(): void {
    if (this.hasRevealed()) {
      return;
    }

    this.hasRevealed.set(true);
    this.revealed.emit();
  }
}
