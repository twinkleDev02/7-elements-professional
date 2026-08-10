import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  input,
  output,
} from '@angular/core';

import { gsap } from 'gsap';

import { isBrowser, prefersReducedMotion } from '@shared/utils/platform.util';

/**
 * Distributor hero, shared by both pages.
 *
 * Everything that differs between them — script line, title, badge, CTAs — is
 * an input, so the two pages read as one design without a second component.
 */
@Component({
  selector: 'app-distributor-hero',
  imports: [],
  templateUrl: './distributor-hero.component.html',
  styleUrl: './distributor-hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DistributorHeroComponent {
  private readonly host = inject(ElementRef<HTMLElement>).nativeElement as HTMLElement;
  private readonly destroyRef = inject(DestroyRef);

  readonly script = input<string>();
  readonly titleLines = input.required<readonly string[]>();
  readonly body = input<string>();

  readonly primaryCta = input<string>();
  readonly secondaryCta = input<string>();

  /** Circular trust badge. Both must be set for it to render. */
  readonly badgeValue = input<string>();
  readonly badgeLabel = input<string>();

  readonly image = input<string>();
  readonly imageAlt = input('');

  readonly primaryAction = output<void>();
  readonly secondaryAction = output<void>();

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

        gsap
          .timeline({ defaults: { ease: 'power3.out', duration: 0.9 } })
          .from(q('.distributor-hero__image'), { autoAlpha: 0, scale: 1.12, duration: 1.5 }, 0)
          .from(q('.distributor-hero__glow'), { autoAlpha: 0, duration: 1.4 }, 0.15)
          .from(q('.distributor-hero__script'), { autoAlpha: 0, y: 16 }, 0.3)
          // Masked lines, so each wipes up from behind the one above it.
          .from(q('.distributor-hero__title-line'), { yPercent: 115, autoAlpha: 0, stagger: 0.11 }, 0.4)
          .from(q('.distributor-hero__body'), { autoAlpha: 0, y: 20 }, 0.72)
          .from(q('.distributor-hero__cta'), { autoAlpha: 0, y: 18, scale: 0.95, stagger: 0.1 }, 0.85)
          .from(q('.distributor-hero__badge'), { autoAlpha: 0, scale: 0.8, duration: 0.8 }, 0.95);

        // Slow breathing on the glow; the product itself stays still.
        gsap.to(q('.distributor-hero__glow'), {
          scale: 1.07,
          opacity: 0.75,
          duration: 3.4,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        });

        this.bindPointerParallax(q);
      }, this.host);

      this.destroyRef.onDestroy(() => context.revert());
    });
  }

  /** `quickTo` reuses one tween per property rather than one per pointermove. */
  private bindPointerParallax(q: gsap.utils.SelectorFunc): void {
    const figure = q('.distributor-hero__figure')[0];

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
