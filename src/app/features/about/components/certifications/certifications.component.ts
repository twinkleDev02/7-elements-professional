import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { useScrollReveal } from '@shared/animations/scroll-reveal';

import {
  ABOUT_CERTIFICATIONS,
  ABOUT_CERTIFICATIONS_EYEBROW,
  AboutFeature,
  FRENCH_FORMULATION,
} from '../../about.data';

@Component({
  selector: 'app-certifications',
  imports: [],
  templateUrl: './certifications.component.html',
  styleUrl: './certifications.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CertificationsComponent {
  readonly certifications = input<readonly AboutFeature[]>(ABOUT_CERTIFICATIONS);
  readonly eyebrow = input(ABOUT_CERTIFICATIONS_EYEBROW);

  protected readonly french = FRENCH_FORMULATION;

  constructor() {
    useScrollReveal(({ q, revealUp }) => {
      revealUp(q('.certifications__reveal'), { y: 20 });
      revealUp(q('.certifications__badge'), { y: 20, scale: 0.9, stagger: 0.07, duration: 0.7 });
    });
  }
}
