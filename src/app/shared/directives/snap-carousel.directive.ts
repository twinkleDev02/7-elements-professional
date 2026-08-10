import {
  DestroyRef,
  Directive,
  ElementRef,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';

import { isBrowser } from '@shared/utils/platform.util';

/** Pointer travel, in px, past which a drag suppresses the click that follows. */
const DRAG_CLICK_THRESHOLD = 6;

/**
 * Turns an overflowing element into a premium carousel: mouse drag, wheel
 * translation, and arrow navigation on top of native scroll-snap.
 *
 * Native scrolling does the heavy lifting — touch momentum, snapping, keyboard
 * panning and accessibility all come from the platform — so this only adds what
 * the platform is missing. There is no second animation loop to fight GSAP.
 *
 * ```html
 * <ul class="track" appSnapCarousel #carousel="snapCarousel">…</ul>
 * <button [disabled]="!carousel.canScrollNext()" (click)="carousel.scrollByCard(1)">
 * ```
 *
 * The host still needs the scroll CSS (`overflow-x`, `scroll-snap-type`); this
 * owns behaviour, not appearance.
 */
@Directive({
  selector: '[appSnapCarousel]',
  exportAs: 'snapCarousel',
  host: {
    '[class.is-dragging]': 'isDragging()',
    '(scroll)': 'onScroll()',
    '(wheel)': 'onWheel($event)',
    '(pointerdown)': 'onPointerDown($event)',
    '(pointermove)': 'onPointerMove($event)',
    '(pointerup)': 'onPointerUp($event)',
    '(pointercancel)': 'onPointerUp($event)',
    '(click)': 'onClick($event)',
  },
})
export class SnapCarouselDirective {
  private readonly track = inject(ElementRef<HTMLElement>).nativeElement as HTMLElement;
  private readonly destroyRef = inject(DestroyRef);

  /** False when every item fits, so arrows can hide themselves. */
  readonly hasOverflow = signal(false);
  readonly canScrollPrev = signal(false);
  readonly canScrollNext = signal(false);
  readonly isDragging = signal(false);
  /** Index of the item nearest the centre, for an active highlight. */
  readonly activeIndex = signal(0);

  private dragStartX = 0;
  private dragStartScroll = 0;
  private dragDistance = 0;
  private scrollFrame = 0;

  constructor() {
    if (!isBrowser()) {
      return;
    }

    afterNextRender(() => {
      this.update();

      // Item widths are set in `%`, so a viewport change alters overflow
      // without any scroll event firing.
      const observer = new ResizeObserver(() => this.update());
      observer.observe(this.track);
      this.destroyRef.onDestroy(() => observer.disconnect());
    });
  }

  /** Advances by one item width, including the gap between items. */
  scrollByCard(direction: -1 | 1): void {
    const first = this.track.firstElementChild as HTMLElement | null;
    const gap = Number.parseFloat(getComputedStyle(this.track).columnGap) || 0;
    const step = first ? first.offsetWidth + gap : this.track.clientWidth * 0.8;

    this.track.scrollBy({ left: step * direction, behavior: 'smooth' });
  }

  /** Throttled to one update per frame — scroll fires faster than paint. */
  protected onScroll(): void {
    if (this.scrollFrame) {
      return;
    }

    this.scrollFrame = requestAnimationFrame(() => {
      this.scrollFrame = 0;
      this.update();
    });
  }

  private update(): void {
    const maxScroll = this.track.scrollWidth - this.track.clientWidth;

    this.hasOverflow.set(maxScroll > 1);
    this.canScrollPrev.set(this.track.scrollLeft > 1);
    this.canScrollNext.set(this.track.scrollLeft < maxScroll - 1);

    const centre = this.track.scrollLeft + this.track.clientWidth / 2;
    const items = Array.from(this.track.children) as HTMLElement[];

    let nearest = 0;
    let shortest = Number.POSITIVE_INFINITY;

    items.forEach((item, index) => {
      const distance = Math.abs(item.offsetLeft + item.offsetWidth / 2 - centre);

      if (distance < shortest) {
        shortest = distance;
        nearest = index;
      }
    });

    // Written only on change, so a scroll does not trigger change detection
    // on every frame.
    if (nearest !== this.activeIndex()) {
      this.activeIndex.set(nearest);
    }
  }

  // ---------------------------------------------------------------------------
  // Mouse drag
  //
  // Mouse only: touch already pans natively with real momentum, and hijacking
  // it would replace that with something worse.
  // ---------------------------------------------------------------------------

  protected onPointerDown(event: PointerEvent): void {
    if (event.pointerType !== 'mouse' || event.button !== 0) {
      return;
    }

    this.dragStartX = event.clientX;
    this.dragStartScroll = this.track.scrollLeft;
    this.dragDistance = 0;
    this.isDragging.set(true);
    this.track.setPointerCapture(event.pointerId);
  }

  protected onPointerMove(event: PointerEvent): void {
    if (!this.isDragging()) {
      return;
    }

    const delta = event.clientX - this.dragStartX;
    this.dragDistance = Math.abs(delta);
    this.track.scrollLeft = this.dragStartScroll - delta;
  }

  protected onPointerUp(event: PointerEvent): void {
    if (!this.isDragging()) {
      return;
    }

    this.isDragging.set(false);

    if (this.track.hasPointerCapture(event.pointerId)) {
      this.track.releasePointerCapture(event.pointerId);
    }

    // Dropping `is-dragging` restores scroll-snap, and the browser settles the
    // track onto the nearest item by itself.
  }

  /** Swallows the click a browser fires after a drag, so it never navigates. */
  protected onClick(event: MouseEvent): void {
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
   * Translates a vertical wheel into horizontal travel, handing the gesture
   * back to the page at either end so the section never traps the scroll.
   */
  protected onWheel(event: WheelEvent): void {
    const maxScroll = this.track.scrollWidth - this.track.clientWidth;

    if (maxScroll <= 1) {
      return;
    }

    // A trackpad's horizontal swipe already scrolls the track natively.
    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) {
      return;
    }

    const atStart = this.track.scrollLeft <= 1 && event.deltaY < 0;
    const atEnd = this.track.scrollLeft >= maxScroll - 1 && event.deltaY > 0;

    if (atStart || atEnd) {
      return;
    }

    event.preventDefault();
    // Keeps the event from reaching Lenis on the window, which would otherwise
    // scroll the page at the same time.
    event.stopPropagation();

    this.track.scrollLeft += event.deltaY;
  }
}
