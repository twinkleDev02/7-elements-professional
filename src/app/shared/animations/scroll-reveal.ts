import { DestroyRef, ElementRef, afterNextRender, inject } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { isBrowser, prefersReducedMotion } from '@shared/utils/platform.util';

import { DURATION, EASE, STAGGER } from './animation.tokens';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export interface ScrollRevealApi {
  /** Selector scoped to the host element. */
  readonly q: gsap.utils.SelectorFunc;
  readonly host: HTMLElement;

  /**
   * The house entrance: fade and rise, staggered, fired once when the section
   * enters the viewport. Every section uses this so the whole page shares one
   * rhythm instead of each block inventing its own timing.
   */
  readonly revealUp: (targets: gsap.TweenTarget, vars?: gsap.TweenVars) => void;

  /** Slow counter-drift as the section passes through the viewport. */
  readonly parallax: (targets: gsap.TweenTarget, distance?: number) => void;
}

/**
 * Wires a section's scroll-triggered entrance, scoped to the component's host
 * and reverted on destroy.
 *
 * Call from a component's injection context. Skipped entirely on the server and
 * for visitors who prefer reduced motion — which is why every animation here is
 * a `from()`: the markup is authored in its final state, so skipping leaves a
 * complete section rather than an invisible one.
 */
export function useScrollReveal(setup: (api: ScrollRevealApi) => void): void {
  const host = inject(ElementRef<HTMLElement>).nativeElement as HTMLElement;
  const destroyRef = inject(DestroyRef);

  if (!isBrowser()) {
    return;
  }

  afterNextRender(() => {
    if (prefersReducedMotion()) {
      return;
    }

    const context = gsap.context((self) => {
      const q = self.selector as gsap.utils.SelectorFunc;

      const revealUp = (targets: gsap.TweenTarget, vars: gsap.TweenVars = {}) => {
        const { scrollTrigger, ...rest } = vars;

        gsap.from(targets, {
          autoAlpha: 0,
          y: 32,
          stagger: STAGGER.base,
          duration: DURATION.base,
          ease: EASE.luxe,
          // Without this, GSAP's leftover inline transform outranks any CSS
          // hover transform on the same element.
          clearProps: 'transform,opacity,visibility',
          ...rest,
          scrollTrigger: {
            trigger: host,
            start: 'top 80%',
            once: true,
            ...(scrollTrigger as ScrollTrigger.StaticVars),
          },
        });
      };

      const parallax = (targets: gsap.TweenTarget, distance = 5) => {
        gsap.fromTo(
          targets,
          { yPercent: distance },
          {
            yPercent: -distance,
            ease: 'none',
            scrollTrigger: {
              trigger: host,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        );
      };

      setup({ q, host, revealUp, parallax });
    }, host);

    destroyRef.onDestroy(() => context.revert());
  });
}
