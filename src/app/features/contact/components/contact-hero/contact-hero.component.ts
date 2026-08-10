import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
} from '@angular/core';

import { gsap } from 'gsap';

import { isBrowser, prefersReducedMotion } from '@shared/utils/platform.util';

import { CONTACT_HERO } from '../../contact.data';

@Component({
  selector: 'app-contact-hero',
  imports: [],
  templateUrl: './contact-hero.component.html',
  styleUrl: './contact-hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactHeroComponent {
  private readonly host = inject(ElementRef<HTMLElement>).nativeElement as HTMLElement;
  private readonly destroyRef = inject(DestroyRef);

  protected readonly content = CONTACT_HERO;

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
          .from(q('.contact-hero__eyebrow'), { autoAlpha: 0, y: 16 }, 0.3)
          // Masked lines, so each wipes up from behind the one above it.
          .from(q('.contact-hero__title-line'), { yPercent: 115, autoAlpha: 0, stagger: 0.11 }, 0.4)
          .from(q('.contact-hero__body'), { autoAlpha: 0, y: 20 }, 0.72);
      }, this.host);

      this.destroyRef.onDestroy(() => context.revert());
    });
  }
}
