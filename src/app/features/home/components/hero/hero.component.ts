import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { FrameSequence } from '@shared/animations/frame-sequence';
import { ROUTES } from '@shared/utils/app.constants';
import { isBrowser, prefersReducedMotion } from '@shared/utils/platform.util';

import { HERO_FRAMES, HERO_FRAMES_LIGHT } from './hero.frames';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * How long the hero holds, as a multiple of the viewport height.
 *
 * Expressed in viewports rather than pixels because a fixed `+=4000` is four
 * screens of scrolling on a laptop and nearly six on a phone — the same number
 * describes two different experiences. On a 1080px-tall window `desktop` works
 * out to roughly 3,700px, which is about three flicks of a trackpad for fifty
 * frames: enough that the camera move reads as a move, short enough that nobody
 * wonders whether the page has stopped responding.
 */
const PIN_LENGTH = {
  desktop: 3.4,
  tablet: 2.6,
  handheld: 1.9,
} as const;

/**
 * How long the scroll must be quiet before the film resolves onto a whole
 * frame. Long enough not to fire between the frames of a continuous scroll,
 * short enough that the picture is sharp by the time the eye settles on it.
 */
const IDLE_BEFORE_SETTLE = 140;

/** Normalised timeline positions. The pin's whole length is `0 → 1`. */
const CUE = {
  /** The film runs slightly short of the end, so the last frame gets a beat. */
  filmEnd: 0.92,
  contentExit: 0.2,
  contentExitSpan: 0.13,
  /** Where chapter two lands; chapter three follows one interval later. */
  chapterFirst: 0.34,
  chapterInterval: 0.31,
  chapterIn: 0.13,
  chapterOut: 0.11,
  /** Chapters linger this long after arriving before they are dismissed. */
  chapterHold: 0.2,
} as const;

/** A beat of copy laid over the film. Chapter one is the hero's own markup. */
interface HeroChapter {
  readonly eyebrow: string;
  readonly title: string;
  readonly note: string;
}

/**
 * Home hero — a scroll-driven film.
 *
 * ## Why a canvas and not a slider
 *
 * `banner_images/` is not a set of banners. It is fifty sequential frames of
 * one continuous camera push-in: it opens wide, with an empty warm field beside
 * the podium, and closes tight on the bottles. Cross-fading those as slides
 * would throw away the only thing they have — continuity — so the hero scrubs
 * through them as footage instead, one canvas, one `drawImage` per frame.
 *
 * The transitions the brief asks for (clip-path reveals, blur, drift) are on
 * the copy chapters riding over the film, where a cut is meaningful, rather
 * than between frames that are already a continuous move.
 *
 * ## The static hero underneath
 *
 * Chapter one is authored in its resting state and the poster frame is painted
 * by the stylesheet, so with the timeline absent — reduced motion, a failed
 * chunk, a canvas that never loads — the hero is exactly the section it was
 * before any of this: artwork, headline, calls to action, credentials.
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

  private readonly stageRef = viewChild.required<ElementRef<HTMLElement>>('stage');
  private readonly canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private readonly glowRef = viewChild.required<ElementRef<HTMLElement>>('glow');
  private readonly scrimRef = viewChild.required<ElementRef<HTMLElement>>('scrim');
  private readonly vignetteRef = viewChild.required<ElementRef<HTMLElement>>('vignette');
  private readonly contentRef = viewChild.required<ElementRef<HTMLElement>>('content');
  private readonly cueRef = viewChild<ElementRef<HTMLElement>>('cue');

  protected readonly collectionLink = `/${ROUTES.products}`;
  protected readonly storyLink = `/${ROUTES.about}`;

  /**
   * Whether the scroll film will run. Settled synchronously in the constructor
   * so the first render already knows whether to emit the extra chapters — they
   * only make sense stacked under a timeline that shows them one at a time.
   */
  protected readonly cinematic = signal(false);

  /**
   * Chapters two and three. Deliberately terse: the film is the story, and copy
   * competing with it would be two things asking for attention at once. The
   * product names are the ones on the bottles in frame, and chapter three's
   * note repeats the formulation claims already made above rather than
   * inventing a new promise.
   */
  protected readonly chapters: readonly HeroChapter[] = [
    {
      eyebrow: 'The Formulation',
      title: 'Argan. Shea. Keratin.',
      note: 'Three actives, blended into one system of repair.',
    },
    {
      eyebrow: 'Salon Professional',
      title: 'Every Strand, Considered.',
      note: 'Sulfate free. Paraben free. Silicone free.',
    },
  ];

  constructor() {
    if (!isBrowser()) {
      return;
    }

    this.cinematic.set(!prefersReducedMotion());

    afterNextRender(() => this.mount());
  }

  /** Builds the sequence and hands the timeline over to `matchMedia`. */
  private mount(): void {
    const canvas = this.canvasRef().nativeElement;

    // The frame list is chosen once. Half rate on handhelds, where the pin is
    // roughly half as long and the dropped frames would never be painted.
    const sources = window.matchMedia('(min-width: 48rem)').matches
      ? HERO_FRAMES
      : HERO_FRAMES_LIGHT;

    const sequence = new FrameSequence(canvas, sources, () => {
      // Only now is there something to see: the canvas fades up over the poster
      // the stylesheet has been showing since first paint.
      canvas.classList.add('is-ready');
    });

    this.destroyRef.onDestroy(() => sequence.destroy());

    const media = gsap.matchMedia();
    this.destroyRef.onDestroy(() => media.revert());

    media.add(
      {
        reduced: '(prefers-reduced-motion: reduce)',
        desktop: '(min-width: 64rem)',
        tablet: '(min-width: 48rem) and (max-width: 63.999rem)',
        handheld: '(max-width: 47.999rem)',
        pointer: '(hover: hover) and (pointer: fine)',
      },
      (context) => {
        const conditions = (context.conditions ?? {}) as Record<string, boolean>;

        // Reduced motion outranks every width: no pin, no scrub, no chapters —
        // just the opening frame under the hero's own copy.
        if (conditions['reduced']) {
          sequence.render(0);
          return undefined;
        }

        const desktop = conditions['desktop'] === true;
        const length = desktop
          ? PIN_LENGTH.desktop
          : conditions['tablet']
            ? PIN_LENGTH.tablet
            : PIN_LENGTH.handheld;

        const pointer = conditions['pointer'] === true;

        const stopFilm = this.buildTimeline(sequence, length, desktop);
        const stopPointer = pointer ? this.trackPointer() : undefined;

        return () => {
          stopFilm();
          stopPointer?.();
        };
      },
    );
  }

  /**
   * The pinned timeline. Every tween is positioned in the normalised `0 → 1`
   * space of `CUE`, so retiming a beat is one number and never a cascade.
   *
   * @param rich Desktop. Gates the two things phones pay most for: a blur
   *             filter, which repaints text every scrubbed frame, and parallax
   *             wide enough to be worth compositing.
   * @returns Teardown for the ticker callback the film settles on.
   */
  private buildTimeline(sequence: FrameSequence, length: number, rich: boolean): () => void {
    const stage = this.stageRef().nativeElement;
    const canvas = this.canvasRef().nativeElement;
    const content = this.contentRef().nativeElement;

    // A plain object the scrub drives. Deliberately *not* snapped to whole
    // frames: `render` cross-dissolves fractional positions, and snapping would
    // throw away exactly the resolution that makes the move continuous.
    const playhead = { frame: 0 };

    /** Where the canvas actually is, and when the scrub last moved it. */
    const film = { shown: 0, movedAt: 0 };

    const timeline = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: stage,
        start: 'top top',
        // A function, with `invalidateOnRefresh`, so a rotated phone or a
        // resized window recomputes the distance instead of keeping the pin
        // length it was born with.
        end: () => `+=${Math.round(window.innerHeight * length)}`,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        scrub: rich ? 0.7 : 0.6,
        invalidateOnRefresh: true,
        // Deliberately no `snap` here. Snapping the trigger would land the film
        // on whole frames, but ScrollTrigger's snap drives the scroll position,
        // and against a pin whose `end` is a function re-measured on every
        // refresh it oscillated between the pin's two extremes — measurably:
        // successive resting points painted frame 50, then 1, then 50 again.
        // The same result is reached below by settling the canvas rather than
        // the page, which cannot move the document and so cannot feed back.
        // This pin adds three-odd viewports of spacing above every other
        // section on the page, so their triggers must be measured after it
        // regardless of which component happened to register first.
        refreshPriority: 1,
      },
    });

    // ---- The film -----------------------------------------------------------

    timeline.to(
      playhead,
      {
        frame: sequence.length - 1,
        duration: CUE.filmEnd,
        onUpdate: () => {
          film.shown = playhead.frame;
          film.movedAt = performance.now();
          sequence.render(film.shown);
        },
      },
      0,
    );

    // Settle onto a whole frame once the scroll goes quiet.
    //
    // Mid-dissolve the canvas holds two frames at once, and while the picture
    // is moving that reads as motion blur. Stop scrolling there and it stops
    // being blur: it becomes a double exposure, every product label printed
    // twice. So shortly after the last scrub update the shown position eases to
    // the nearest whole frame and the picture resolves.
    //
    // On GSAP's own ticker rather than a second `requestAnimationFrame` loop,
    // and both guards fail fast, so the steady-state cost is two comparisons a
    // frame.
    const settle = () => {
      if (performance.now() - film.movedAt < IDLE_BEFORE_SETTLE) {
        return;
      }

      const goal = Math.round(film.shown);
      const remaining = goal - film.shown;

      if (Math.abs(remaining) < 0.002) {
        return;
      }

      film.shown = Math.abs(remaining) < 0.02 ? goal : film.shown + remaining * 0.16;
      sequence.render(film.shown);
    };

    gsap.ticker.add(settle);

    // ---- Depth --------------------------------------------------------------
    //
    // Three layers drifting at their own rates. Each is a transform or an
    // opacity, so the whole pin stays on the compositor. The canvas move is
    // deliberately tiny: the footage is already a camera push, and a second
    // zoom on top of it reads as a mistake rather than as depth.

    // Kept small on purpose. The frames are 1280×720 and a full-bleed desktop
    // hero already stretches them about 1.5×, so every percent of parallax
    // scale is spent on top of an upscale that is costing sharpness. The drift
    // is the smallest that still reads as depth.
    const drift = rich ? 0.9 : 0.45;

    // The scale never returns to 1. It cannot: the film is drifting `±drift`
    // percent and the pointer adds a few pixels more, so anything under
    // `1 + 2 × drift` slides an edge of the canvas into frame and exposes the
    // poster behind it. The floor here clears both, and no more.
    timeline.fromTo(
      canvas,
      { scale: 1.038 + drift / 50, xPercent: drift },
      { scale: 1.014 + drift / 50, xPercent: -drift, duration: 1 },
      0,
    );

    timeline.fromTo(
      this.glowRef().nativeElement,
      { xPercent: -drift * 3, yPercent: 1.5, opacity: 0.45 },
      { xPercent: drift * 3, yPercent: -1.5, opacity: 0.78, duration: 1 },
      0,
    );

    // The warm field the copy sits on closes up as the camera pushes in, so the
    // vignette arrives late to hold the frame together at its tightest.
    timeline.fromTo(
      this.vignetteRef().nativeElement,
      { opacity: 0 },
      { opacity: 0.34, duration: 0.42, ease: 'power1.in' },
      0.58,
    );

    // The scrim thins as the camera closes in.
    //
    // It is a sheet of near-opaque cream over the leading half of the frame,
    // and at the opening it costs nothing — there is only empty backdrop under
    // there. By the closing frame the podium and the hair mask have moved into
    // that same half, and a scrim strong enough to carry the headline turns
    // them milky. Since the chapters that replace the headline are three short
    // lines of large display type rather than a paragraph, they stay legible on
    // far less, so the scrim gives most of itself back.
    timeline.fromTo(
      this.scrimRef().nativeElement,
      { opacity: 1 },
      { opacity: 0.58, duration: 0.6, ease: 'power1.inOut' },
      0.22,
    );

    // ---- Chapter one leaves -------------------------------------------------
    //
    // Bottom up: the claims go first, the headline last, so the eye is walked
    // out of the copy rather than having it vanish underneath it.

    timeline.to(
      Array.from(content.children),
      {
        autoAlpha: 0,
        yPercent: -22,
        stagger: { each: 0.012, from: 'end' },
        duration: CUE.contentExitSpan,
        ease: 'power1.in',
      },
      CUE.contentExit,
    );

    // The blur goes on the block, not on each child. A `filter` is a repaint,
    // not a composite, so blurring five elements individually costs five
    // repaints per scrubbed tick — alongside a canvas that is already redrawing
    // — where blurring their shared parent costs one and looks identical.
    if (rich) {
      timeline.to(
        content,
        { filter: 'blur(6px)', duration: CUE.contentExitSpan, ease: 'power1.in' },
        CUE.contentExit,
      );
    }

    const cue = this.cueRef()?.nativeElement;

    if (cue) {
      timeline.to(cue, { autoAlpha: 0, duration: 0.06, ease: 'power1.in' }, 0.03);
    }

    // ---- Chapters two and three arrive --------------------------------------

    const chapters = Array.from(this.host.querySelectorAll<HTMLElement>('.hero__chapter'));

    chapters.forEach((chapter, index) => {
      const at = CUE.chapterFirst + index * CUE.chapterInterval;
      const lines = Array.from(chapter.children);

      timeline.fromTo(
        lines,
        {
          autoAlpha: 0,
          y: 38,
          // The reveal the brief asks for: each line wipes up through its own
          // box rather than fading in place, which is what separates a cut from
          // a dissolve.
          clipPath: 'inset(0% 0% 100% 0%)',
        },
        {
          autoAlpha: 1,
          y: 0,
          clipPath: 'inset(0% 0% 0% 0%)',
          stagger: 0.018,
          duration: CUE.chapterIn,
          ease: 'power2.out',
        },
        at,
      );

      // Again on the block rather than the lines, for the same reason.
      if (rich) {
        timeline.fromTo(
          chapter,
          { filter: 'blur(9px)' },
          { filter: 'blur(0px)', duration: CUE.chapterIn, ease: 'power2.out' },
          at,
        );
      }

      // The last chapter is the closing frame — it holds until the pin lets go.
      if (index < chapters.length - 1) {
        timeline.to(
          lines,
          {
            autoAlpha: 0,
            y: -30,
            stagger: { each: 0.012, from: 'end' },
            duration: CUE.chapterOut,
            ease: 'power1.in',
          },
          at + CUE.chapterHold,
        );

        if (rich) {
          timeline.to(
            chapter,
            { filter: 'blur(7px)', duration: CUE.chapterOut, ease: 'power1.in' },
            at + CUE.chapterHold,
          );
        }
      }
    });

    return () => gsap.ticker.remove(settle);
  }

  /**
   * Mouse-follow, desktop pointers only.
   *
   * Deliberately just below the threshold of notice: a few pixels of counter-
   * movement between the film, the glow and the copy, which the eye reads as
   * parallax depth rather than as an effect. `quickTo` reuses one tween per
   * property instead of allocating a new one per mouse event, and moves `x`/`y`
   * where the timeline moves `xPercent`/`yPercent` — different components of
   * the same transform, so neither overwrites the other.
   *
   * @returns Its own teardown, which `matchMedia` runs when the query stops
   *          matching or the component is destroyed.
   */
  private trackPointer(): () => void {
    const settle = { duration: 0.9, ease: 'power3.out' } as const;

    const canvas = this.canvasRef().nativeElement;
    const glow = this.glowRef().nativeElement;
    const content = this.contentRef().nativeElement;

    const canvasX = gsap.quickTo(canvas, 'x', settle);
    const canvasY = gsap.quickTo(canvas, 'y', settle);
    const glowX = gsap.quickTo(glow, 'x', settle);
    const glowY = gsap.quickTo(glow, 'y', settle);
    const contentX = gsap.quickTo(content, 'x', settle);

    const onPointerMove = (event: PointerEvent) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 2;
      const y = (event.clientY / window.innerHeight - 0.5) * 2;

      canvasX(x * 6);
      canvasY(y * 4);
      glowX(x * -12);
      glowY(y * -8);
      contentX(x * -4);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });

    return () => window.removeEventListener('pointermove', onPointerMove);
  }
}
