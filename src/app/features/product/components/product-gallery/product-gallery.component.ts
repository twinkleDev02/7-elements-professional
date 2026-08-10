import {
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';

import { gsap } from 'gsap';

import { isBrowser, prefersReducedMotion } from '@shared/utils/platform.util';
import { registerSwiperElements } from '@shared/utils/swiper.util';

import { GalleryItem } from '../../product-detail.data';

registerSwiperElements();

/**
 * Product gallery: a large stage with a Swiper thumbnail rail beneath it.
 *
 * Swiper drives the thumbnails only. The stage is a single element that
 * crossfades between sources, which keeps the transition under our control and
 * avoids mounting every full-size image at once.
 */
@Component({
  selector: 'app-product-gallery',
  imports: [],
  templateUrl: './product-gallery.component.html',
  styleUrl: './product-gallery.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // Required for `<swiper-container>` / `<swiper-slide>`.
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProductGalleryComponent {
  private readonly destroyRef = inject(DestroyRef);

  readonly items = input.required<readonly GalleryItem[]>();
  readonly productName = input('');

  private readonly stage = viewChild<ElementRef<HTMLElement>>('stage');
  private readonly thumbs = viewChild<ElementRef<HTMLElement>>('thumbs');

  protected readonly activeIndex = signal(0);
  protected readonly active = computed(() => this.items()[this.activeIndex()]);
  protected readonly isVideoPlaying = signal(false);

  constructor() {
    if (!isBrowser()) {
      return;
    }

    afterNextRender(() => {
      this.initThumbs();

      if (prefersReducedMotion()) {
        return;
      }

      const stage = this.stage()?.nativeElement;

      if (stage) {
        // Cinematic entrance for the stage only; the rail follows in the
        // page-level timeline.
        const tween = gsap.from(stage, {
          autoAlpha: 0,
          scale: 0.96,
          duration: 0.9,
          ease: 'power3.out',
          clearProps: 'transform,opacity,visibility',
        });

        this.destroyRef.onDestroy(() => tween.kill());
      }
    });
  }

  /**
   * Swiper Element is initialised manually (`init="false"` in the template)
   * because breakpoint maps cannot be expressed as HTML attributes — the
   * documented approach for anything beyond simple scalar params.
   */
  private initThumbs(): void {
    const element = this.thumbs()?.nativeElement as (HTMLElement & {
      initialize?: () => void;
    }) | undefined;

    if (!element?.initialize) {
      return;
    }

    Object.assign(element, {
      slidesPerView: 4,
      spaceBetween: 10,
      freeMode: true,
      watchOverflow: true,
      breakpoints: {
        0: { slidesPerView: 3.4, spaceBetween: 8 },
        576: { slidesPerView: 4.5, spaceBetween: 10 },
        992: { slidesPerView: 4, spaceBetween: 10 },
      },
    });

    element.initialize();
  }

  protected select(index: number): void {
    if (index === this.activeIndex()) {
      return;
    }

    this.isVideoPlaying.set(false);
    this.activeIndex.set(index);
    this.crossfadeStage();
  }

  /** Fades and lifts the stage as its source swaps. */
  private crossfadeStage(): void {
    const stage = this.stage()?.nativeElement;

    if (!stage || prefersReducedMotion()) {
      return;
    }

    gsap.fromTo(
      stage,
      { autoAlpha: 0, scale: 1.03 },
      {
        autoAlpha: 1,
        scale: 1,
        duration: 0.45,
        ease: 'power2.out',
        clearProps: 'transform,opacity,visibility',
      },
    );
  }

  /** Swaps the poster for the real player, so the file loads only on demand. */
  protected playVideo(): void {
    this.isVideoPlaying.set(true);
  }
}
