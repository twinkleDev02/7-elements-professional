import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, inject } from '@angular/core';

/**
 * True when running in a browser. Call from an injection context (field
 * initialiser, constructor, factory) before touching `window`, `document`,
 * `IntersectionObserver`, GSAP or Lenis, so the code stays SSR-safe if
 * server-side rendering is added later.
 */
export function isBrowser(): boolean {
  return isPlatformBrowser(inject(PLATFORM_ID));
}

/** True when the visitor has asked the OS to minimise motion. */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return false;
  }

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
