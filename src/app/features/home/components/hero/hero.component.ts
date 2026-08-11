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

import { ROUTES } from '@shared/utils/app.constants';
import { isBrowser, prefersReducedMotion } from '@shared/utils/platform.util';

/**
 * Where the hero earns its entrance.
 *
 * Mirrors the stylesheet's `lg`. Phones pay the most for motion and gain the
 * least from it, so below this width the hero simply renders as authored.
 */
const MOTION_QUERY = '(min-width: 64rem)';

/**
 * Where a hover is a deliberate act rather than the first half of a tap.
 *
 * Touch browsers synthesise `mouseenter` on tap, so without this the film would
 * restart every time a phone visitor reached for a call to action.
 */
const HOVER_QUERY = '(hover: hover) and (pointer: fine)';

/** The banner film, and the frame that stands in until it is ready. */
const FILM = {
  src: 'assets/videos/banner_video.mp4',
  /** Frame 0 of the film itself, so the hand-off to playback is seamless. */
  poster: 'assets/images/brand/banner_video_poster.jpg',

  /**
   * Where a play — first or restarted — begins, in seconds.
   *
   * Zero, as specified. It is a named constant because the supplied cut opens
   * on roughly two seconds of embossed "7 Elements Professional" logo card:
   * baked-in type, which the brief asks the film not to contain, sitting behind
   * a headline and below a header that both already carry the mark.
   *
   * Setting this to `2.1` opens on the salon interior instead and the card is
   * never seen. The poster must then be re-cut from the same timecode, or the
   * still and the first frame will not agree. Left at zero because which of the
   * two is right is a brand decision, not a technical one.
   */
  startAt: 0,
} as const;

/** True when the viewport is wide enough for the hero's entrance. */
function motionIsWelcome(): boolean {
  return window.matchMedia(MOTION_QUERY).matches;
}

/**
 * Home hero.
 *
 * The artwork is the section's CSS background rather than an `<img>`: it is a
 * flattened composite that carries no information the copy does not, so it is
 * decoration, and decoration belongs in the stylesheet.
 *
 * ## What is deliberately absent
 *
 * This used to be a pinned, scroll-scrubbed sequence — the composite scaled
 * from an origin parked over the bottle cluster, six layers drifting at their
 * own rates, driven through Lenis so the scrub and the scroll advanced on one
 * frame. All of it is gone, along with Lenis itself: with nothing scrubbed
 * there is nothing to synchronise, and smooth-scroll is a page-level concern
 * that should not be installed by a section. The hero now holds still and the
 * page scrolls past it natively.
 *
 * What remains is a one-shot entrance on load, desktop only. Every tween is a
 * `from()`, so the markup is authored in its final state: with JavaScript off,
 * on a phone, or under `prefers-reduced-motion`, the hero renders complete.
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

  private readonly filmRef = viewChild<ElementRef<HTMLVideoElement>>('film');

  protected readonly collectionLink = `/${ROUTES.products}`;
  protected readonly storyLink = `/${ROUTES.about}`;

  protected readonly filmSrc = FILM.src;
  protected readonly filmPoster = FILM.poster;

  /**
   * Whether the film plays at all.
   *
   * False under `prefers-reduced-motion`, where the element still renders — the
   * poster is the hero's artwork either way — but nothing autoplays and, thanks
   * to `preload="none"`, none of the two-and-a-half megabytes is fetched.
   */
  protected readonly filmPlays = signal(false);

  /** Set once the DOM exists; gates the hover restart to real pointers. */
  private hoverIsMeaningful = false;

  constructor() {
    if (!isBrowser()) {
      return;
    }

    const reduced = prefersReducedMotion();
    this.filmPlays.set(!reduced);

    afterNextRender(() => {
      this.hoverIsMeaningful = window.matchMedia(HOVER_QUERY).matches;
      this.startFilm();

      // The GSAP entrance keeps its own, narrower conditions: it is desktop
      // only, where the film is not.
      if (reduced || !motionIsWelcome()) {
        return;
      }

      const context = gsap.context((self) => {
        this.playEntrance(self.selector as gsap.utils.SelectorFunc);
      }, this.host);

      this.destroyRef.onDestroy(() => context.revert());
    });
  }

  /**
   * Mutes the film, then plays it once.
   *
   * This is the only thing that starts playback — the element carries no
   * `autoplay` attribute — which is what guarantees the first frame is never
   * reached before the mute is in place. The autoplay policy tests the `muted`
   * *property*, and a template can only render an attribute, so relying on the
   * markup alone leaves a window where a browser that permits unmuted autoplay
   * will take it.
   *
   * There is no `loop`, so the element does exactly what the brief asks when it
   * reaches the end: it stops, holding the last frame. That needs no code.
   */
  private startFilm(): void {
    const film = this.filmRef()?.nativeElement;

    if (!film) {
      return;
    }

    // Silence first, before anything can start, and unconditionally — set ahead
    // of the `filmPlays` guard so the element is never left claiming it has
    // sound. `defaultMuted` is the one that survives a reload of the source:
    // it backs the attribute, so a re-fetch cannot come back audible.
    film.defaultMuted = true;
    film.muted = true;

    if (!this.filmPlays()) {
      return;
    }

    // A no-op while `startAt` is zero, and the one line that has to be here
    // rather than only in the restart for a non-zero value to mean anything on
    // a cold load.
    if (FILM.startAt > 0) {
      film.currentTime = FILM.startAt;
    }

    // Autoplay can still be refused — data saver, battery saver, a per-site
    // preference. That is not an error worth surfacing: the poster is already
    // on screen and the hero reads as a still.
    void film.play().catch(() => undefined);
  }

  /**
   * Restarts the film from the top when the pointer enters the hero.
   *
   * Nothing is bound to the pointer leaving: the brief asks for playback to
   * carry on naturally afterwards, and the way to do that is to not interfere.
   */
  protected restartFilm(): void {
    const film = this.filmRef()?.nativeElement;

    if (!film || !this.filmPlays() || !this.hoverIsMeaningful) {
      return;
    }

    film.currentTime = FILM.startAt;
    void film.play().catch(() => undefined);
  }

  /** Staged reveal, roughly 1.8s end to end. Runs once, on load. */
  private playEntrance(q: gsap.utils.SelectorFunc): void {
    gsap
      .timeline({ defaults: { ease: 'power3.out', duration: 0.9 } })
      // One fade on the wrapper for the entire visual: the glow and the
      // background both belong to `.hero__media`, so fading it reveals them
      // together and leaves their own opacity untouched.
      .from(q('.hero__media'), { opacity: 0, duration: 1.1, ease: 'power1.out' }, 0)
      .from(q('.hero__eyebrow'), { autoAlpha: 0, y: 18 }, 0.5)
      // Masked lines, so each wipes up from behind the one above it.
      .from(q('.hero__title-line'), { yPercent: 115, autoAlpha: 0, stagger: 0.1 }, 0.7)
      .from(q('.hero__subtitle'), { autoAlpha: 0, y: 22 }, 0.9)
      .from(q('.hero__cta'), { autoAlpha: 0, y: 20, scale: 0.95, stagger: 0.09 }, 1.1)
      .from(q('.hero__claim'), { autoAlpha: 0, y: 14, stagger: 0.06, duration: 0.6 }, 1.2)
      .from(q('.hero__feature'), { autoAlpha: 0, y: 26, stagger: 0.08, duration: 0.7 }, 1.3);
  }
}
