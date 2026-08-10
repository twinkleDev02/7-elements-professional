import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { ROUTES } from '@shared/utils/app.constants';
import { isBrowser, prefersReducedMotion } from '@shared/utils/platform.util';

import { CollectionCardData, HOME_COLLECTIONS } from './collections.data';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/** Pointer travel, in px, past which a drag suppresses the click that follows. */
const DRAG_CLICK_THRESHOLD = 6;

/**
 * Collections carousel.
 *
 * Built on native overflow scrolling with CSS scroll-snap rather than a
 * carousel library: touch momentum, snapping, keyboard scrolling and
 * accessibility all come from the platform, and the only thing left to add is
 * mouse drag, wheel translation and the arrows. That is a fraction of the code
 * a library would need, and there is no second animation loop to fight GSAP.
 *
 * The track is always scrollable markup; when the cards happen to fit, the
 * arrows disable themselves and it reads as a plain row.
 */
@Component({
  selector: 'app-collections',
  imports: [RouterLink],
  templateUrl: './collections.component.html',
  styleUrl: './collections.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionsComponent {
  private readonly host = inject(ElementRef<HTMLElement>).nativeElement as HTMLElement;
  private readonly destroyRef = inject(DestroyRef);

  private readonly track = viewChild.required<ElementRef<HTMLElement>>('track');

  /** Defaults to the bundled list; pass an API-loaded one to override. */
  readonly collections = input<readonly CollectionCardData[]>(HOME_COLLECTIONS);

  readonly eyebrow = input('Our Collections');
  readonly heading = input('Care. Nourish. Transform.');

  /** Index of the card nearest the centre of the viewport, for the highlight. */
  protected readonly activeIndex = signal(0);
  protected readonly canScrollPrev = signal(false);
  protected readonly canScrollNext = signal(false);
  /** False when every card fits, which hides the arrows entirely. */
  protected readonly hasOverflow = signal(false);
  protected readonly isDragging = signal(false);

  private dragStartX = 0;
  private dragStartScroll = 0;
  private dragDistance = 0;
  private scrollFrame = 0;

  constructor() {
    if (!isBrowser()) {
      return;
    }

    afterNextRender(() => {
      this.updateScrollState();
      this.observeResize();

      if (prefersReducedMotion()) {
        return;
      }

      const context = gsap.context((self) => {
        const q = self.selector as gsap.utils.SelectorFunc;
        this.buildRevealAnimations(q);
      }, this.host);

      this.destroyRef.onDestroy(() => context.revert());
    });
  }

  protected collectionLink(collection: CollectionCardData): string {
    return `/${ROUTES.products}/${collection.slug}`;
  }

  // ---------------------------------------------------------------------------
  // Animation
  // ---------------------------------------------------------------------------

  private buildRevealAnimations(q: gsap.utils.SelectorFunc): void {
    gsap.from(q('.collections__reveal'), {
      autoAlpha: 0,
      y: 26,
      stagger: 0.12,
      duration: 0.85,
      ease: 'power3.out',
      // `clearProps` matters here: GSAP writes inline transforms, and an inline
      // transform left behind would outrank the CSS hover lift on the cards.
      clearProps: 'transform,opacity,visibility',
      scrollTrigger: { trigger: this.host, start: 'top 78%', once: true },
    });

    gsap.from(q('.collections__card'), {
      autoAlpha: 0,
      y: 42,
      scale: 0.95,
      stagger: 0.09,
      duration: 0.9,
      ease: 'power3.out',
      clearProps: 'transform,opacity,visibility',
      scrollTrigger: { trigger: q('.collections__carousel')[0], start: 'top 85%', once: true },
    });

    // Subtle drift on the whole carousel rather than per card, so it never
    // competes with a card's own hover transform.
    gsap.fromTo(
      q('.collections__carousel'),
      { yPercent: 3 },
      {
        yPercent: -3,
        ease: 'none',
        scrollTrigger: {
          trigger: this.host,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      },
    );
  }

  // ---------------------------------------------------------------------------
  // Scroll state
  // ---------------------------------------------------------------------------

  private observeResize(): void {
    const observer = new ResizeObserver(() => this.updateScrollState());
    observer.observe(this.track().nativeElement);
    this.destroyRef.onDestroy(() => observer.disconnect());
  }

  /** Throttled to one update per frame — scroll fires far faster than paint. */
  protected onScroll(): void {
    if (this.scrollFrame) {
      return;
    }

    this.scrollFrame = requestAnimationFrame(() => {
      this.scrollFrame = 0;
      this.updateScrollState();
    });
  }

  private updateScrollState(): void {
    const track = this.track().nativeElement;
    const maxScroll = track.scrollWidth - track.clientWidth;

    this.hasOverflow.set(maxScroll > 1);
    this.canScrollPrev.set(track.scrollLeft > 1);
    this.canScrollNext.set(track.scrollLeft < maxScroll - 1);

    const viewportCentre = track.scrollLeft + track.clientWidth / 2;
    const cards = Array.from(track.children) as HTMLElement[];

    let nearest = 0;
    let shortestDistance = Number.POSITIVE_INFINITY;

    cards.forEach((card, index) => {
      const distance = Math.abs(card.offsetLeft + card.offsetWidth / 2 - viewportCentre);

      if (distance < shortestDistance) {
        shortestDistance = distance;
        nearest = index;
      }
    });

    // Only write when it actually changes, to avoid a change-detection pass on
    // every frame of a scroll.
    if (nearest !== this.activeIndex()) {
      this.activeIndex.set(nearest);
    }
  }

  // ---------------------------------------------------------------------------
  // Navigation
  // ---------------------------------------------------------------------------

  protected scrollByCard(direction: -1 | 1): void {
    const track = this.track().nativeElement;
    const first = track.firstElementChild as HTMLElement | null;
    const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
    const step = first ? first.offsetWidth + gap : track.clientWidth * 0.8;

    track.scrollBy({ left: step * direction, behavior: 'smooth' });
  }

  // ---------------------------------------------------------------------------
  // Mouse drag
  //
  // Mouse only. Touch already gets native panning with real momentum, and
  // intercepting it would replace that with something worse.
  // ---------------------------------------------------------------------------

  protected onPointerDown(event: PointerEvent): void {
    if (event.pointerType !== 'mouse' || event.button !== 0) {
      return;
    }

    const track = this.track().nativeElement;

    this.dragStartX = event.clientX;
    this.dragStartScroll = track.scrollLeft;
    this.dragDistance = 0;
    this.isDragging.set(true);

    track.setPointerCapture(event.pointerId);
  }

  protected onPointerMove(event: PointerEvent): void {
    if (!this.isDragging()) {
      return;
    }

    const delta = event.clientX - this.dragStartX;
    this.dragDistance = Math.abs(delta);
    this.track().nativeElement.scrollLeft = this.dragStartScroll - delta;
  }

  protected onPointerUp(event: PointerEvent): void {
    if (!this.isDragging()) {
      return;
    }

    const track = this.track().nativeElement;

    this.isDragging.set(false);

    if (track.hasPointerCapture(event.pointerId)) {
      track.releasePointerCapture(event.pointerId);
    }

    // Re-enabling scroll-snap (the `is-dragging` class drops off here) lets the
    // browser settle the track onto the nearest card by itself.
  }

  /**
   * Swallows the click that a browser fires after a drag, so releasing the
   * mouse over a card does not navigate to it.
   */
  protected onClickCapture(event: MouseEvent): void {
    if (this.dragDistance > DRAG_CLICK_THRESHOLD) {
      event.preventDefault();
      event.stopPropagation();
      this.dragDistance = 0;
    }
  }

  // ---------------------------------------------------------------------------
  // Wheel
  // ---------------------------------------------------------------------------

  /**
   * Turns a vertical wheel into horizontal travel while the pointer is over the
   * track, and hands the gesture back to the page at either end so the section
   * never traps the scroll.
   */
  protected onWheel(event: WheelEvent): void {
    const track = this.track().nativeElement;
    const maxScroll = track.scrollWidth - track.clientWidth;

    if (maxScroll <= 1) {
      return;
    }

    // A trackpad's horizontal swipe already scrolls the track natively; only
    // a predominantly vertical wheel needs translating.
    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) {
      return;
    }

    const atStart = track.scrollLeft <= 1 && event.deltaY < 0;
    const atEnd = track.scrollLeft >= maxScroll - 1 && event.deltaY > 0;

    if (atStart || atEnd) {
      return;
    }

    event.preventDefault();
    // Stops the event reaching Lenis on the window, which would otherwise
    // scroll the page at the same time.
    event.stopPropagation();

    track.scrollLeft += event.deltaY;
  }
}
