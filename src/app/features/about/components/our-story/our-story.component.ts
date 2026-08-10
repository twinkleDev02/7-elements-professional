import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { useScrollReveal } from '@shared/animations/scroll-reveal';

import { ABOUT_STORY, AboutFeature, STORY_FEATURES } from '../../about.data';

@Component({
  selector: 'app-our-story',
  imports: [],
  templateUrl: './our-story.component.html',
  styleUrl: './our-story.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OurStoryComponent {
  readonly features = input<readonly AboutFeature[]>(STORY_FEATURES);

  protected readonly content = ABOUT_STORY;

  constructor() {
    useScrollReveal(({ q, revealUp, parallax }) => {
      revealUp(q('.our-story__reveal'));
      revealUp(q('.our-story__feature'), { y: 22, stagger: 0.08 });

      // Restrained counter-drift; the frame stays put, the photograph moves.
      parallax(q('.our-story__image'), 4);
    });
  }
}
