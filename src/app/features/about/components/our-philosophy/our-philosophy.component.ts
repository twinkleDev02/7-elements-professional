import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { useScrollReveal } from '@shared/animations/scroll-reveal';

import { ABOUT_PHILOSOPHY, AboutFeature, PHILOSOPHY_PILLARS } from '../../about.data';

@Component({
  selector: 'app-our-philosophy',
  imports: [],
  templateUrl: './our-philosophy.component.html',
  styleUrl: './our-philosophy.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OurPhilosophyComponent {
  readonly pillars = input<readonly AboutFeature[]>(PHILOSOPHY_PILLARS);

  protected readonly content = ABOUT_PHILOSOPHY;

  constructor() {
    useScrollReveal(({ q, revealUp }) => {
      revealUp(q('.our-philosophy__reveal'), { y: 24 });
      revealUp(q('.our-philosophy__pillar'), { y: 22, stagger: 0.1 });
    });
  }
}
