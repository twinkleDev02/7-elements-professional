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

import { ROUTES } from '@shared/utils/app.constants';
import { isBrowser, prefersReducedMotion } from '@shared/utils/platform.util';

import { ABOUT_HERO } from '../../about.data';

@Component({
  selector: 'app-about-hero',
  imports: [RouterLink],
  templateUrl: './about-hero.component.html',
  styleUrl: './about-hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutHeroComponent {
  private readonly host = inject(ElementRef<HTMLElement>).nativeElement as HTMLElement;
  private readonly destroyRef = inject(DestroyRef);

  protected readonly content = ABOUT_HERO;
  protected readonly ctaLink = `/${ROUTES.products}`;

  constructor() {
    if (!isBrowser()) {
      return;
    }

    afterNextRender(() => {
      if (prefersReducedMotion()) {
        return;
      }

      const context = gsap.context((self) => {
        const q = self.selector as gsap.utils.SelectorFunc;

        const timeline = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.9 } });

        timeline
          .from(q('.about-hero__image'), { autoAlpha: 0, scale: 1.1, duration: 1.5 }, 0)
          .from(q('.about-hero__eyebrow'), { autoAlpha: 0, y: 18 }, 0.3)
          // Masked lines, so each wipes up from behind the one above it.
          .from(q('.about-hero__title-line'), { yPercent: 115, autoAlpha: 0, stagger: 0.11 }, 0.4)
          .from(q('.about-hero__tagline'), { autoAlpha: 0, y: 20 }, 0.68)
          .from(q('.about-hero__body'), { autoAlpha: 0, y: 20 }, 0.8)
          .from(q('.about-hero__cta'), { autoAlpha: 0, y: 20, scale: 0.95 }, 0.92);

        this.bindPointerParallax(q);
      }, this.host);

      this.destroyRef.onDestroy(() => context.revert());
    });
  }

  /**
   * Very restrained pointer drift. `quickTo` reuses one tween per property
   * rather than allocating a new one on every `pointermove`.
   */
  private bindPointerParallax(q: gsap.utils.SelectorFunc): void {
    const figure = q('.about-hero__figure')[0];

    // Fine pointers only; on touch there is no hover and the listener is waste.
    if (!figure || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      return;
    }

    const settings: gsap.TweenVars = { duration: 0.9, ease: 'power3.out' };
    const moveX = gsap.quickTo(figure, 'x', settings);
    const moveY = gsap.quickTo(figure, 'y', settings);

    const onPointerMove = (event: PointerEvent) => {
      moveX((event.clientX / window.innerWidth - 0.5) * -14);
      moveY((event.clientY / window.innerHeight - 0.5) * -10);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    this.destroyRef.onDestroy(() => window.removeEventListener('pointermove', onPointerMove));
  }
}
