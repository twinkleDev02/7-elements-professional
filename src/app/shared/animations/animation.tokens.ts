/**
 * Shared motion vocabulary. Every animation in the app pulls its timing from
 * here so the whole site feels like one product rather than a set of pages that
 * each invented their own easing.
 */

/** Durations in seconds — GSAP's unit. */
export const DURATION = {
  instant: 0.15,
  fast: 0.3,
  base: 0.6,
  slow: 0.9,
  cinematic: 1.4,
} as const;

/** GSAP easing names. `luxe` is the house curve: slow out, unhurried settle. */
export const EASE = {
  luxe: 'power3.out',
  entrance: 'power2.out',
  exit: 'power2.in',
  emphasis: 'expo.out',
} as const;

/** Delay between siblings in a staggered reveal, in seconds. */
export const STAGGER = {
  tight: 0.06,
  base: 0.12,
  loose: 0.2,
} as const;

/** Fraction of the viewport a section must reach before its reveal fires. */
export const SCROLL_TRIGGER_THRESHOLD = 0.2;
