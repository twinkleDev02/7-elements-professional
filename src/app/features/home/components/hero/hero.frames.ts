/**
 * The hero film.
 *
 * `public/assets/images/banner_images/` holds fifty sequential frames of a
 * single continuous camera move — a slow push-in that starts wide, with an
 * empty warm field to the left of the podium, and ends tight on the bottles.
 * They are not four interchangeable banners, so the hero scrubs through them as
 * footage rather than cross-fading between them as slides.
 *
 * The names are generated rather than listed: the asset is an exported frame
 * dump with a fixed `ezgif-frame-NNN.jpg` pattern, and fifty hand-typed string
 * literals would be fifty chances to typo a filename that only fails at
 * runtime. If the export is ever replaced, `FRAME_COUNT` is the single edit.
 *
 * Paths are absolute from the web root because `public/` is copied there
 * verbatim by the `assets` glob in `angular.json`.
 */

const DIRECTORY = '/assets/images/banner_images';

/** Frames on disk, numbered from 1. */
const FRAME_COUNT = 50;

function frameSrc(ordinal: number): string {
  return `${DIRECTORY}/ezgif-frame-${String(ordinal).padStart(3, '0')}.jpg`;
}

/** Every frame, in playback order. */
export const HERO_FRAMES: readonly string[] = Array.from({ length: FRAME_COUNT }, (_, index) =>
  frameSrc(index + 1),
);

/**
 * Half the frames, for handhelds.
 *
 * The pin is roughly half as long on a phone, so a full-rate sequence would
 * advance two frames per scrubbed frame anyway — the dropped ones would never
 * be painted, only paid for. The final frame is kept regardless of parity so
 * the film still lands on its closing composition.
 */
export const HERO_FRAMES_LIGHT: readonly string[] = HERO_FRAMES.filter(
  (_, index) => index % 2 === 0 || index === FRAME_COUNT - 1,
);

/**
 * The frame the hero shows before any script runs.
 *
 * Also the poster painted by the stylesheet, which is what makes the hero
 * complete under `prefers-reduced-motion` and correct during the moment between
 * first paint and the canvas taking over.
 */
export const HERO_POSTER = HERO_FRAMES[0];
