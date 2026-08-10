import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { useScrollReveal } from '@shared/animations/scroll-reveal';
import { VideoFeatureComponent } from '@shared/components/video-feature/video-feature.component';

import { ABOUT_FILM } from '../../about.data';

/**
 * Brand film.
 *
 * Sits between Our Story and Our Philosophy: the narrative is told in prose,
 * then shown. It also breaks up the long run of panel-and-icon blocks that
 * follows, which the page needs for rhythm.
 *
 * The player itself is `VideoFeatureComponent` from `shared/` — this section
 * only supplies content and the scroll reveal.
 */
@Component({
  selector: 'app-brand-film',
  imports: [VideoFeatureComponent],
  templateUrl: './brand-film.component.html',
  styleUrl: './brand-film.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrandFilmComponent {
  readonly content = input(ABOUT_FILM);

  constructor() {
    useScrollReveal(({ q, revealUp }) => {
      revealUp(q('.brand-film__video'), { y: 30, scale: 0.96, duration: 0.95 });
    });
  }
}
