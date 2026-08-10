import { ChangeDetectionStrategy, Component } from '@angular/core';

import { AboutHeroComponent } from './components/about-hero/about-hero.component';
import { BrandFilmComponent } from './components/brand-film/brand-film.component';
import { CertificationsComponent } from './components/certifications/certifications.component';
import { FinalCtaComponent } from './components/final-cta/final-cta.component';
import { MissionVisionComponent } from './components/mission-vision/mission-vision.component';
import { OurPhilosophyComponent } from './components/our-philosophy/our-philosophy.component';
import { OurStoryComponent } from './components/our-story/our-story.component';
import { ProfessionalCollectionsComponent } from './components/professional-collections/professional-collections.component';
import { PromiseComponent } from './components/promise/promise.component';
import { StatisticsComponent } from './components/statistics/statistics.component';

/**
 * About page.
 *
 * Composition only — every section owns its own markup, styling and animation
 * under `components/`, and its copy lives in `about.data.ts`.
 */
@Component({
  selector: 'app-about',
  imports: [
    AboutHeroComponent,
    OurStoryComponent,
    BrandFilmComponent,
    OurPhilosophyComponent,
    StatisticsComponent,
    PromiseComponent,
    ProfessionalCollectionsComponent,
    MissionVisionComponent,
    CertificationsComponent,
    FinalCtaComponent,
  ],
  templateUrl: './about.html',
  styleUrl: './about.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class About {}
