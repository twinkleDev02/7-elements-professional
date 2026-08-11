/**
 * A scroll-scrubbable image sequence rendered to a single `<canvas>`.
 *
 * The alternative — fifty stacked `<img>` elements cross-faded by opacity —
 * costs fifty composited layers and fifty decodes held in memory at once. One
 * canvas costs one layer and one `drawImage` per changed frame, which is the
 * only reason a sequence this long is affordable on a phone.
 *
 * ## Loading
 *
 * Frames are fetched in order, a few at a time. Sequential order matters: the
 * visitor sees frame 0 first and frame 49 last, so fetching them in that order
 * means the sequence is usable long before it is complete. The concurrency cap
 * keeps the request queue short enough that the first frame — which is the
 * page's largest contentful paint — is not stuck behind forty-nine siblings.
 *
 * ## Rendering
 *
 * `render()` never blocks and never blanks the canvas. If the requested frame
 * has not arrived it draws the nearest one that has, so a fast scroll on a slow
 * connection degrades into a coarser film rather than a black rectangle.
 */

/** How many frame requests may be in flight at once. */
const MAX_PARALLEL_REQUESTS = 6;

/** `fetchPriority` is newer than the DOM lib shipped with some TS versions. */
type PrioritisedImage = HTMLImageElement & { fetchPriority?: 'high' | 'low' | 'auto' };

// The dissolve is deliberately linear. Weighting it towards whole frames would
// shorten the double-exposed middle, but it would do so by making the film
// linger on each frame and then hurry — which is the stepping this exists to
// remove. Continuity is this function's job; landing sharp when the scroll
// stops is the caller's, and is handled there.

export class FrameSequence {
  private readonly images: (HTMLImageElement | undefined)[];
  private readonly ready: boolean[];

  private context: CanvasRenderingContext2D | null = null;

  /** The blend currently painted, or `-1`s before the first paint. */
  private painted = { lower: -1, upper: -1, mix: -1 };

  private inFlight = 0;
  private cursor = 0;
  private disposed = false;

  /**
   * Whether the backing store has been matched to the frames.
   *
   * Tracked explicitly rather than inferred from `canvas.width`, which starts
   * at the HTML default of 300 — never at 0 — so there is no falsy value to
   * test for.
   */
  private sized = false;

  /**
   * @param canvas   Target. Its backing store is sized to the first frame's
   *                 intrinsic dimensions; fitting to the layout box is the
   *                 stylesheet's job (`object-fit`), which keeps this class out
   *                 of the resize business entirely.
   * @param sources  Frame URLs, in playback order.
   * @param onFirstFrame Fired once, after frame 0 is painted.
   */
  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly sources: readonly string[],
    private readonly onFirstFrame?: () => void,
  ) {
    this.images = new Array<HTMLImageElement | undefined>(sources.length);
    this.ready = new Array<boolean>(sources.length).fill(false);

    // `alpha: false` lets the compositor skip per-pixel blending: every frame is
    // an opaque JPEG that covers the canvas completely.
    this.context = canvas.getContext('2d', { alpha: false });

    this.pump();
  }

  /** Number of frames in the sequence. */
  get length(): number {
    return this.sources.length;
  }

  /**
   * Paints the sequence at a *fractional* position — 12.4 is 40% of the way
   * from frame 12 to frame 13, painted as a cross-dissolve between the two.
   *
   * This is what makes fifty stills read as a camera move. Snapped to whole
   * frames, a long scrub holds each frame for tens of pixels of scroll and then
   * cuts to the next: measurably, most scroll steps paint nothing and the rest
   * jump. Because consecutive frames here differ only by a hair of camera push,
   * dissolving between them is indistinguishable from having shot the move at a
   * far higher frame rate — the sequence gains continuous resolution without
   * gaining a single byte.
   *
   * Safe to call every tick: a position that rounds to the blend already on
   * screen returns without touching the canvas.
   */
  render(position: number): void {
    if (this.disposed || !this.context) {
      return;
    }

    const last = this.sources.length - 1;
    const clamped = Math.min(last, Math.max(0, position));
    const base = Math.floor(clamped);

    const lower = this.nearestReady(base);

    if (lower < 0) {
      return;
    }

    // `nearestReady` searches backwards first, so an undownloaded successor
    // resolves to `lower` and the dissolve degrades to a straight cut rather
    // than a hole.
    const upper = this.nearestReady(Math.min(last, base + 1));
    const mix = upper > lower ? clamped - base : 0;

    const painted = this.painted;
    const settled =
      lower === painted.lower && upper === painted.upper && Math.abs(mix - painted.mix) < 0.004;

    if (settled) {
      return;
    }

    const under = this.images[lower];
    const over = this.images[upper];

    if (!under) {
      return;
    }

    const { width, height } = this.canvas;

    this.context.globalAlpha = 1;
    this.context.drawImage(under, 0, 0, width, height);

    if (over && mix > 0) {
      this.context.globalAlpha = mix;
      this.context.drawImage(over, 0, 0, width, height);
      this.context.globalAlpha = 1;
    }

    this.painted = { lower, upper, mix };
  }

  /**
   * Drops every handler and reference so a component teardown mid-download
   * leaves nothing holding the decoded bitmaps alive.
   */
  destroy(): void {
    this.disposed = true;

    for (const image of this.images) {
      if (image) {
        image.onload = null;
        image.onerror = null;
      }
    }

    this.images.fill(undefined);
    this.context = null;
  }

  /**
   * Closest downloaded frame to `wanted` — searching backwards first, since a
   * slightly earlier frame reads as the film lagging rather than jumping ahead.
   */
  private nearestReady(wanted: number): number {
    for (let i = wanted; i >= 0; i--) {
      if (this.ready[i]) {
        return i;
      }
    }

    for (let i = wanted + 1; i < this.ready.length; i++) {
      if (this.ready[i]) {
        return i;
      }
    }

    return -1;
  }

  /** Tops the request queue back up to the concurrency cap. */
  private pump(): void {
    while (!this.disposed && this.inFlight < MAX_PARALLEL_REQUESTS && this.cursor < this.sources.length) {
      this.fetch(this.cursor++);
    }
  }

  private fetch(index: number): void {
    const image = new Image() as PrioritisedImage;

    // Frame 0 is the hero's largest contentful paint; the rest are progressive
    // enhancement and must not compete with it for bandwidth.
    image.fetchPriority = index === 0 ? 'high' : 'low';
    image.decoding = 'async';

    image.onload = () => this.settle(index, true);
    image.onerror = () => this.settle(index, false);

    this.images[index] = image;
    this.inFlight++;
    image.src = this.sources[index];
  }

  private settle(index: number, loaded: boolean): void {
    if (this.disposed) {
      return;
    }

    this.inFlight--;
    this.ready[index] = loaded;

    // The backing store is sized once, from whichever frame lands first. Every
    // frame in a sequence shares one resolution, so there is nothing to redo —
    // and resizing a canvas clears it, so doing it twice would blank the film.
    //
    // Keyed on the first *successful* frame rather than specifically frame 0:
    // if the opening frame 404s, the sequence should still come up on the next
    // one that arrives rather than stay hidden behind the poster forever.
    if (loaded && !this.sized) {
      const image = this.images[index];

      if (image?.naturalWidth) {
        this.canvas.width = image.naturalWidth;
        this.canvas.height = image.naturalHeight;
        this.sized = true;

        this.render(index);
        this.onFirstFrame?.();
      }
    }

    this.pump();
  }
}
