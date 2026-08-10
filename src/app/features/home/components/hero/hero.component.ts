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
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import { ROUTES } from '@shared/utils/app.constants';
import { isBrowser, prefersReducedMotion } from '@shared/utils/platform.util';

// Registered once at module scope rather than per instance — re-registering is
// harmless but wasteful, and the guard keeps it off the server.
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Where the hero earns its motion.
 *
 * Mirrors the stylesheet's `lg`: below it the hero stacks, is not pinned, and
 * has no room for the sequence to read. Phones also pay the most for it — a
 * hijacked scroll and a pile of composited layers on the slowest hardware — so
 * below this width the hero simply renders as authored.
 */
const MOTION_QUERY = '(min-width: 64rem)';

/** True when the viewport is wide enough for the hero sequence. */
function motionIsWelcome(): boolean {
  return window.matchMedia(MOTION_QUERY).matches;
}

/**
 * Height of the sticky site header, or 0 if it is not present.
 *
 * The hero rests directly beneath it, so the pin has to start at the same
 * offset or the composition jumps upward the moment it engages.
 */
function stickyHeaderHeight(): number {
  const header = document.querySelector('app-navbar');
  return header ? Math.round(header.getBoundingClientRect().height) : 0;
}

/**
 * Reads a percentage custom property off an element, falling back if it is
 * missing or malformed. Keeps the timeline's centring maths tied to the zoom
 * origin declared in the stylesheet, so re-aiming the zoom needs one edit
 * rather than two that can drift apart.
 */
function readOriginPercent(host: HTMLElement, property: string, fallback: number): number {
  const raw = getComputedStyle(host).getPropertyValue(property).trim();
  const value = Number.parseFloat(raw);

  return Number.isFinite(value) ? value : fallback;
}

/**
 * Home hero — a pinned, scroll-driven sequence.
 *
 * ## Why the composition animates as a whole
 *
 * Every image in this project is RGB with no alpha channel, and the hero art is
 * a single flattened 1885x834 composite: model, bottles, blossoms and ring
 * light are the same pixels. Independent girl / product / flower layers are
 * therefore impossible — overlaying a product PNG would paint an opaque
 * rectangle over the scene.
 *
 * The "product comes toward you" beat is instead produced by scaling the
 * composite from a transform-origin parked over the bottle cluster
 * (`--hero-zoom-origin` in the stylesheet), so the products fill the frame as
 * the scale climbs. Depth comes from the six layers that genuinely are
 * separate — section gradient, media, glow, figure, copy, credentials bar —
 * each moving at its own rate.
 *
 * Supply transparent cut-outs of the model and the Nano Plex bottle and this
 * becomes true multi-plane parallax; the timeline structure would not change.
 *
 * ## Performance
 *
 * Only `transform` and `opacity` are animated, so the whole sequence stays on
 * the compositor. Entrance tweens are all `from()`, so the markup is authored
 * in its final state: with JavaScript off, or under `prefers-reduced-motion`,
 * the hero renders complete, unpinned and readable.
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

  /** Pointer parallax is muted once the hero scrolls out of the viewport. */
  private isHeroActive = true;

  constructor() {
    if (!isBrowser()) {
      return;
    }

    afterNextRender(() => {
      // Honour the OS motion preference: no smooth-scroll hijacking, no pin,
      // no parallax. The static layout is the fallback, and it is complete.
      if (prefersReducedMotion()) {
        return;
      }

      // The pinned sequence below is registered through `gsap.matchMedia`, so
      // it sets itself up and tears itself down as the viewport crosses `lg`.
      // These three cannot: they are one-shot at startup. Gating them here
      // keeps the smooth-scroll hijack and the entrance off phones entirely.
      if (motionIsWelcome()) {
        this.initSmoothScroll();

        const context = gsap.context((self) => {
          const q = self.selector as gsap.utils.SelectorFunc;

          this.playEntrance(q);
          this.bindPointerParallax(q);
        }, this.host);

        this.destroyRef.onDestroy(() => context.revert());
      }

      this.buildScrollCinema();
      this.refreshWhenArtLoads();
    });
  }

  // ---------------------------------------------------------------------------
  // Smooth scroll
  // ---------------------------------------------------------------------------

  /**
   * Lenis, driven by GSAP's ticker so scroll position and tween playback
   * advance on the same frame. Two independent RAF loops is what makes scrubbed
   * pinning judder.
   *
   * NOTE: smooth scroll is a page-level concern and belongs in `MainLayout`.
   * It lives here because the hero was scoped that way; the guard below stops a
   * second instance if it is ever lifted.
   */
  private initSmoothScroll(): void {
    if ((window as { __lenis?: unknown }).__lenis) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });

    (window as { __lenis?: unknown }).__lenis = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    // Lag smoothing skips frames after a stall, which desynchronises Lenis.
    gsap.ticker.lagSmoothing(0);

    this.destroyRef.onDestroy(() => {
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
      delete (window as { __lenis?: unknown }).__lenis;
    });
  }

  // ---------------------------------------------------------------------------
  // Entrance
  // ---------------------------------------------------------------------------

  /** Staged reveal, roughly 1.8s end to end. Runs once, on load. */
  private playEntrance(q: gsap.utils.SelectorFunc): void {
    const timeline = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.9 } });

    timeline
      // ONE fade, on the wrapper, for the entire visual.
      //
      // The glow and the composite both live inside `.hero__media`, so fading
      // it reveals them together — and leaves their own opacity untouched.
      // That matters: the scroll timeline is scrubbed, so whatever value it
      // records at build time is what it writes back at progress 0. Fading the
      // image here is what made it vanish, because the scrub then pinned it at
      // the `opacity: 0` the entrance had just set.
      //
      // Rule for this component: entrance owns `.hero__media` opacity and
      // `.hero__figure` scale. The scroll timeline owns transforms only, and
      // never touches opacity on the media, figure, image or glow.
      .from(q('.hero__media'), { opacity: 0, duration: 1.1, ease: 'power1.out' }, 0)
      .from(q('.hero__figure'), { scale: 1.08, duration: 1.5 }, 0.3)
      .from(q('.hero__eyebrow'), { autoAlpha: 0, y: 18 }, 0.5)
      // Masked lines, so each wipes up from behind the one above it.
      .from(q('.hero__title-line'), { yPercent: 115, autoAlpha: 0, stagger: 0.1 }, 0.7)
      .from(q('.hero__subtitle'), { autoAlpha: 0, y: 22 }, 0.9)
      .from(q('.hero__cta'), { autoAlpha: 0, y: 20, scale: 0.95, stagger: 0.09 }, 1.1)
      .from(q('.hero__claim'), { autoAlpha: 0, y: 14, stagger: 0.06, duration: 0.6 }, 1.2)
      .from(q('.hero__feature'), { autoAlpha: 0, y: 26, stagger: 0.08, duration: 0.7 }, 1.3);
  }

  // ---------------------------------------------------------------------------
  // Scroll cinema
  // ---------------------------------------------------------------------------

  /**
   * The pinned sequence, sized per breakpoint with `matchMedia`.
   *
   * Each timeline runs to a total duration of 1, so a tween's position
   * parameter *is* its scroll percentage — `0.4` starts at 40% of the pin.
   * That keeps the code readable against the storyboard.
   */
  private buildScrollCinema(): void {
    const media = gsap.matchMedia(this.host);

    media.add(
      {
        // Desktop only. `lg` (64rem) is where the hero switches to the overlay
        // layout with a capped height — and a capped height is precisely what
        // makes pinning viable. Below it the hero stacks taller than the
        // viewport, where the same beats read as the page fighting the thumb,
        // so nothing is registered at all and the section stays static.
        //
        // `matchMedia` owns the lifecycle: resize past this boundary and the
        // sequence builds itself; resize back and it reverts cleanly.
        desktop: MOTION_QUERY,
      },
      (context) => {
        // Scoped to the host because `matchMedia` was given a scope; a bare
        // `gsap.utils.toArray` would reach across the whole document.
        const q = context.selector as gsap.utils.SelectorFunc;

        // Capped by the source's own resolution, not by taste.
        //
        // `Hero_section_img.png` is 1885px wide and renders ~1425px wide at
        // 1440 (~1905 at 1920). Scaling past ~1.3 therefore asks the browser to
        // invent pixels — at the old 2.1 that was a 1.59x upscale at 1440 and
        // 2.12x at 1920, which is exactly why the products looked soft.
        //
        // This ceiling lifts as soon as real product cut-outs exist: a
        // 1200px-tall bottle displayed at 600px stays sharp even on a 2x
        // screen, so the reveal can be as large as the storyboard wants.
        const zoomPeak = 1.28;
        const zoomMid = 1.15;
        const drift = 1;

        const timeline = gsap.timeline({
          // Linear by default: drift and translation should track the wheel
          // exactly, or the page feels like it is lagging behind the hand.
          // Only the scale ramps get an ease, and they say so explicitly.
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: this.host,
            // Offset by the sticky header's height so the hero pins exactly
            // where it rests. With a bare `top top` it pins flush to the
            // viewport, which slides it up behind the navbar — hiding the
            // eyebrow and shearing the tops off the tall bottles at peak zoom.
            // Read as a function so it re-measures on refresh and resize.
            start: () => `top top+=${stickyHeaderHeight()}`,
            end: '+=200%',
            pin: true,
            // Left to ScrollTrigger's own detection, which picks `fixed` here.
            // Forcing `transform` was over-caution on my part: a fixed element's
            // containing block is the viewport, so the page's `overflow-x: clip`
            // ancestors never clipped it — and transform pinning re-renders the
            // whole pinned subtree each frame, which is what made it judder.
            anticipatePin: 1,
            scrub: 1,
            invalidateOnRefresh: true,
            onToggle: (self) => {
              this.isHeroActive = self.isActive;
            },
          },
        });

        // -- 0–20% · settle ---------------------------------------------------
        // Almost nothing. The composition tightens; the eye stays on the copy.
        timeline
          .to(q('.hero__media'), { scale: 1.03, duration: 0.2, ease: 'power1.out' }, 0)
          .to(
            q('.hero__content'),
            { yPercent: -3 * drift, xPercent: -1.5 * drift, duration: 0.2 },
            0,
          )
          .to(q('.hero__image'), { scale: 1.06, duration: 0.2, ease: 'power1.out' }, 0);

        // -- 20–40% · STAGE 02, the headline splits ----------------------------
        //
        // The words spread outward from the centre of the line rather than
        // fading as one block: "Session" leaves up and to the left, "Beauty"
        // down and to the right, "of" holds near the middle.
        //
        // Offsets are computed from each word's index against the centre, so
        // this holds for any number of words — change the copy and the split
        // still reads correctly.
        //
        // Safe by construction: the entrance animates `.hero__title-line`, this
        // animates `.hero__title-word`. Different elements, so the scrub can
        // never record a mid-entrance value the way it did with the image.
        const words = q('.hero__title-word');
        const centre = (words.length - 1) / 2;

        timeline
          .to(
            words,
            {
              xPercent: (index: number) => (index - centre) * 26 * drift,
              yPercent: (index: number) => (index - centre) * 16 * drift,
              opacity: 0,
              duration: 0.22,
              stagger: 0.035,
              ease: 'power2.in',
            },
            0.18,
          )
          // The rest of the copy follows the split rather than leading it, so
          // the eye reads the headline coming apart before the block leaves.
          // Targets `.hero__content`, which the entrance never touches — the
          // entrance animates its children.
          .to(
            q('.hero__content'),
            { xPercent: -16 * drift, autoAlpha: 0, duration: 0.16, ease: 'power2.in' },
            0.28,
          )
          .to(
            q('.hero__features'),
            { yPercent: 45, autoAlpha: 0, duration: 0.2, ease: 'power2.in' },
            0.2,
          )
          // The legibility scrim exists for the copy. Once the copy has gone it
          // is a cream veil over nothing, so it leaves with it.
          .to(q('.hero__media'), { '--hero-scrim-opacity': 0, duration: 0.25 }, 0.2)
          .to(q('.hero__image'), { scale: zoomMid, duration: 0.2, ease: 'power1.inOut' }, 0.2)
          // Scale only — never opacity. See the note in `playEntrance`.
          .to(q('.hero__glow'), { scale: 1.14, duration: 0.2 }, 0.2);

        // The zoom origin sits right of centre, so scaling alone grows the
        // bottle cluster toward the right edge. Translating by the origin's
        // offset from centre is what actually walks it into the middle of the
        // frame — derived, not guessed, so it stays correct if the origin in
        // the stylesheet is re-aimed.
        // Read from `.hero`, which is where the properties are declared —
        // custom properties inherit downward, so the host element cannot see
        // them and would silently take the fallback.
        const section = (q('.hero')[0] as HTMLElement | undefined) ?? this.host;
        const originX = readOriginPercent(section, '--hero-zoom-origin-x', 72);
        const originY = readOriginPercent(section, '--hero-zoom-origin-y', 66);
        // Scaling by `s` leaves (s - 1) / 2 of the element's size as overhang
        // on each side. Panning further than that drags the empty edge of the
        // media box into frame, so the walk toward centre is clamped to the
        // slack the zoom actually creates.
        // A safety margin is kept back: panning to the full slack puts the
        // element's edge exactly on the frame boundary, and any rounding — or
        // the pointer parallax running at the same time — is enough to reveal
        // the empty media box behind it.
        const slack = ((zoomPeak - 1) / 2) * 100 * 0.6;
        const centreX = Math.max(-(originX - 50), -slack);
        const centreY = Math.max(-(originY - 50), -slack);

        // -- STAGE 03 · 40–58% · the product comes forward ----------------------
        // Three planes at three rates: the composite advances, the environment
        // behind it barely moves, the halo sits between them. That difference
        // is the depth — there is no separate product layer to move.
        timeline
          .to(
            q('.hero__image'),
            {
              scale: zoomPeak * 0.8,
              xPercent: centreX * 0.55 * drift,
              yPercent: centreY * 0.55 * drift,
              duration: 0.18,
              ease: 'power1.inOut',
            },
            0.4,
          )
          .to(q('.hero__media'), { scale: 1.05, duration: 0.18 }, 0.4)
          .to(q('.hero__glow'), { scale: 1.22, duration: 0.18 }, 0.4);

        // -- STAGE 04 · 58–75% · the reveal ------------------------------------
        // Peak scale, arriving on `power2.out` so the product settles and holds
        // rather than still climbing when the stage ends. The cluster finishes
        // its walk to centre here.
        timeline
          .to(
            q('.hero__image'),
            {
              scale: zoomPeak,
              xPercent: centreX * drift,
              yPercent: centreY * drift,
              duration: 0.17,
              ease: 'power2.out',
            },
            0.58,
          )
          // Glow opacity is safe to drive now: the entrance fades only
          // `.hero__media`, so nothing else writes this property.
          .to(
            q('.hero__glow'),
            { scale: 1.45, opacity: 0.8, duration: 0.17, ease: 'power1.out' },
            0.58,
          )
          .to(q('.hero__media'), { scale: 1.07, duration: 0.17 }, 0.58);

        // -- STAGE 05 · 75–88% · the environment transforms ---------------------
        // The halo opens and brightens, which reads as the field behind the
        // product softening — a real blur is impossible here, because the
        // product shares its pixels with the background and would soften too.
        // The product eases back a touch and settles; the tagline rises.
        timeline
          .to(q('.hero__media'), { scale: 1.09, duration: 0.13 }, 0.75)
          .to(
            q('.hero__glow'),
            { scale: 1.75, opacity: 0.95, duration: 0.13, ease: 'power1.out' },
            0.75,
          )
          .to(
            q('.hero__image'),
            { scale: zoomPeak * 0.95, duration: 0.13, ease: 'power1.out' },
            0.75,
          )
          .to(
            q('.hero__tagline'),
            { opacity: 1, duration: 0.08, ease: 'power2.out' },
            0.78,
          )
          .to(
            q('.hero__tagline-word'),
            { yPercent: 0, duration: 0.1, stagger: 0.025, ease: 'power2.out' },
            0.78,
          );

        // -- 88–100% · provisional hand-off ------------------------------------
        // Stage 06 proper is Phase 5. This only walks the composition back
        // toward rest so the unpin does not cut away from a close-up. Scale and
        // the tagline only — the hero visual itself is never faded.
        timeline
          .to(q('.hero__tagline'), { opacity: 0, duration: 0.07 }, 0.88)
          .to(
            q('.hero__image'),
            { scale: zoomPeak * 0.72, xPercent: centreX * 0.6 * drift, duration: 0.12, ease: 'power2.inOut' },
            0.88,
          )
          .to(q('.hero__media'), { scale: 1.01, duration: 0.12, ease: 'power2.inOut' }, 0.88)
          .to(
            q('.hero__glow'),
            { scale: 1.15, opacity: 0.55, duration: 0.12, ease: 'power2.inOut' },
            0.88,
          );
      },
    );

    this.destroyRef.onDestroy(() => media.revert());
  }

  /**
   * The hero art has no intrinsic width/height attributes, so the pin distance
   * can be measured before it decodes. One refresh on load corrects it.
   */
  private refreshWhenArtLoads(): void {
    const image = this.host.querySelector<HTMLImageElement>('.hero__image');

    if (!image || image.complete) {
      return;
    }

    const onLoad = () => ScrollTrigger.refresh();

    image.addEventListener('load', onLoad, { once: true });
    this.destroyRef.onDestroy(() => image.removeEventListener('load', onLoad));
  }

  // ---------------------------------------------------------------------------
  // Pointer parallax
  // ---------------------------------------------------------------------------

  /**
   * Very small pointer drift, layered by depth. `quickTo` reuses one tween per
   * property instead of allocating a new one on every `pointermove`, which is
   * the difference between this being free and being the most expensive thing
   * on the page.
   */
  private bindPointerParallax(q: gsap.utils.SelectorFunc): void {
    // Targets the figure, not the image: the scroll timeline owns the image's
    // scale, and two tweens on one property fight.
    const figure = q('.hero__figure')[0];
    const glow = q('.hero__glow')[0];
    const media = q('.hero__media')[0];

    // Fine pointers only. On touch there is no hover, and the listener would
    // just be dead weight.
    if (!figure || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      return;
    }

    const settings: gsap.TweenVars = { duration: 0.9, ease: 'power3.out' };

    // Depth ladder: the further "forward" a layer reads, the further it travels.
    const mediaX = media ? gsap.quickTo(media, 'x', settings) : null;
    const figureX = gsap.quickTo(figure, 'x', settings);
    const figureY = gsap.quickTo(figure, 'y', settings);
    const glowX = glow ? gsap.quickTo(glow, 'x', settings) : null;
    const glowY = glow ? gsap.quickTo(glow, 'y', settings) : null;

    const onPointerMove = (event: PointerEvent) => {
      if (!this.isHeroActive) {
        return;
      }

      // Normalised to -0.5…0.5 from the centre of the viewport.
      const relativeX = event.clientX / window.innerWidth - 0.5;
      const relativeY = event.clientY / window.innerHeight - 0.5;

      mediaX?.(relativeX * -6);
      figureX(relativeX * -16);
      figureY(relativeY * -10);
      glowX?.(relativeX * -22);
      glowY?.(relativeY * -14);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    this.destroyRef.onDestroy(() => window.removeEventListener('pointermove', onPointerMove));
  }
}
