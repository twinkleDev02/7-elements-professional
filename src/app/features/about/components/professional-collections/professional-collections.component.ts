import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { useScrollReveal } from '@shared/animations/scroll-reveal';
import { SnapCarouselDirective } from '@shared/directives/snap-carousel.directive';
import { ROUTES } from '@shared/utils/app.constants';

import { ABOUT_COLLECTIONS, ABOUT_COLLECTIONS_EYEBROW, AboutCollection } from '../../about.data';

/**
 * Professional collections.
 *
 * Six cards on one row at desktop; below that the same markup becomes a
 * touch-scrolling carousel through `SnapCarouselDirective`, which layers mouse
 * drag and wheel translation on top of native scroll-snap. No Swiper needed —
 * the platform already provides momentum, snapping and accessibility.
 */
@Component({
  selector: 'app-professional-collections',
  imports: [RouterLink, SnapCarouselDirective],
  templateUrl: './professional-collections.component.html',
  styleUrl: './professional-collections.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfessionalCollectionsComponent {
  readonly collections = input<readonly AboutCollection[]>(ABOUT_COLLECTIONS);
  readonly eyebrow = input(ABOUT_COLLECTIONS_EYEBROW);

  constructor() {
    useScrollReveal(({ q, revealUp }) => {
      revealUp(q('.professional-collections__reveal'), { y: 22 });
      revealUp(q('.professional-collections__card'), {
        y: 36,
        scale: 0.95,
        stagger: 0.08,
      });
    });
  }

  protected collectionLink(collection: AboutCollection): string {
    return `/${ROUTES.products}/${collection.slug}`;
  }
}
