import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

import { gsap } from 'gsap';

import { useScrollReveal } from '@shared/animations/scroll-reveal';

import { ABOUT_STATS, AboutStat } from '../../about.data';

@Component({
  selector: 'app-statistics',
  imports: [],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatisticsComponent {
  readonly stats = input<readonly AboutStat[]>(ABOUT_STATS);

  /**
   * Displayed figures, keyed by stat id.
   *
   * Seeded with the final values so the panel reads correctly before any
   * animation runs — on the server, under `prefers-reduced-motion`, or if the
   * trigger never fires. The count-up zeroes them only at the moment it takes
   * over, so the numbers are never wrong while visible.
   */
  protected readonly counts = signal<Record<string, number>>({});

  constructor() {
    this.counts.set(this.toRecord((stat) => stat.value));

    useScrollReveal(({ q, revealUp, host }) => {
      revealUp(q('.statistics__item'), { y: 26, stagger: 0.09 });
      this.animateCounts(host);
    });
  }

  /**
   * Counts each figure up from zero as the panel enters the viewport.
   *
   * The tween drives a plain object and writes through `onUpdate` — how GSAP
   * interpolates a value that is not a CSS property. Only four short numerals
   * repaint, once.
   */
  private animateCounts(host: HTMLElement): void {
    this.counts.set(this.toRecord(() => 0));

    this.stats().forEach((stat, index) => {
      const cursor = { value: 0 };

      gsap.to(cursor, {
        value: stat.value,
        duration: 1.6,
        ease: 'power2.out',
        delay: index * 0.09,
        onUpdate: () => {
          this.counts.update((current) => ({
            ...current,
            [stat.id]: Math.round(cursor.value),
          }));
        },
        scrollTrigger: { trigger: host, start: 'top 82%', once: true },
      });
    });
  }

  private toRecord(pick: (stat: AboutStat) => number): Record<string, number> {
    return Object.fromEntries(this.stats().map((stat) => [stat.id, pick(stat)]));
  }
}
