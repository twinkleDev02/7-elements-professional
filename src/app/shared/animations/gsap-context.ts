import { DestroyRef, ElementRef, afterNextRender, inject } from '@angular/core';
import { gsap } from 'gsap';

import { isBrowser, prefersReducedMotion } from '@shared/utils/platform.util';

/** Everything the setup callback needs to build its timeline. */
export interface GsapContextApi {
  /** Scopes `gsap.utils.selector` lookups to the host element. */
  readonly select: gsap.utils.SelectorFunc;
  /** The host element the animation is attached to. */
  readonly root: HTMLElement;
}

/**
 * Runs a GSAP setup callback once the component has rendered, scoped to the
 * host element, and reverts every tween it created when the component is
 * destroyed.
 *
 * Call from a component's injection context:
 *
 * ```ts
 * export class Hero {
 *   constructor() {
 *     useGsapContext(({ select }) => {
 *       gsap.from(select('.hero__line'), { y: 40, opacity: 0, stagger: STAGGER.base });
 *     });
 *   }
 * }
 * ```
 *
 * Skipped entirely on the server and for visitors who prefer reduced motion —
 * the component's static markup is the reduced-motion fallback, so author
 * templates in their final state and animate *from* an offset, never *to* one.
 */
export function useGsapContext(setup: (api: GsapContextApi) => void): void {
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
      setup({ select: self.selector as gsap.utils.SelectorFunc, root: host });
    }, host);

    destroyRef.onDestroy(() => context.revert());
  });
}
