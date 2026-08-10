import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { useScrollReveal } from '@shared/animations/scroll-reveal';
import { ROUTES } from '@shared/utils/app.constants';

/** One row of the credentials panel beside the copy. */
export interface AboutHighlight {
  readonly id: string;
  readonly title: string;
  readonly subtitle: string;
  /** Raw SVG `d` values, so the glyph travels with the record. */
  readonly iconPaths: readonly string[];
}

const HIGHLIGHTS: readonly AboutHighlight[] = [
  {
    id: 'formulations',
    title: 'Advanced Formulations',
    subtitle: 'Powered by Innovation',
    iconPaths: [
      'M10 3h4v3.4l3.2 5.4a3 3 0 0 1-2.6 4.5H9.4a3 3 0 0 1-2.6-4.5L10 6.4z',
      'M8.5 14h7',
    ],
  },
  {
    id: 'ingredients',
    title: 'Safe Ingredients',
    subtitle: 'No Harmful Chemicals',
    iconPaths: [
      'M12 3.2 19 6v6c0 4.2-2.9 7.4-7 8.8-4.1-1.4-7-4.6-7-8.8V6z',
      'M9 12.2l2.1 2.1L15.5 10',
    ],
  },
  {
    id: 'salon-trusted',
    title: 'Salon Trusted',
    subtitle: 'Professional Results',
    iconPaths: [
      'M12 4a3.2 3.2 0 1 1 0 6.4A3.2 3.2 0 0 1 12 4z',
      'M5.5 20.5a6.5 6.5 0 0 1 13 0',
    ],
  },
  {
    id: 'sustainable',
    title: 'Sustainable Beauty',
    subtitle: 'Good for Hair, Good for Earth',
    iconPaths: [
      'M20 4c0 8.3-4.2 13-9.5 13A5.5 5.5 0 0 1 5 11.5C5 6.8 11 4 20 4z',
      'M4 20c2.5-4.5 6-7.5 11-9.5',
    ],
  },
];

@Component({
  selector: 'app-about-preview',
  imports: [RouterLink],
  templateUrl: './about-preview.component.html',
  styleUrl: './about-preview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutPreviewComponent {
  readonly eyebrow = input('About 7 Elements Professional');
  readonly heading = input('Excellence In Every Drop Of Care');
  readonly body = input(
    'We create high-performance, salon-quality hair care formulas using carefully ' +
      'selected ingredients and advanced technology for exceptional results.',
  );
  readonly signature = input('Crafted with Care');
  readonly badgeLabel = input('Professional Quality');
  readonly highlights = input<readonly AboutHighlight[]>(HIGHLIGHTS);

  protected readonly aboutLink = `/${ROUTES.about}`;

  constructor() {
    useScrollReveal(({ q, revealUp, parallax }) => {
      revealUp(q('.about-preview__reveal'));
      revealUp(q('.about-preview__highlight'), {
        x: 24,
        y: 0,
        stagger: 0.1,
        scrollTrigger: { trigger: q('.about-preview__panel')[0], start: 'top 85%', once: true },
      });

      // The photograph drifts against the page; the frame around it stays put.
      parallax(q('.about-preview__image'), 4);
    });
  }
}
