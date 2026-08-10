import { ChangeDetectionStrategy, Component } from '@angular/core';

import { AboutPreviewComponent } from './components/about-preview/about-preview.component';
import { BestSellersComponent } from './components/best-sellers/best-sellers.component';
import { CollectionsComponent } from './components/collections/collections.component';
import { HeroComponent } from './components/hero/hero.component';
import { NewsletterBandComponent } from './components/newsletter-band/newsletter-band.component';
import { OfferBannerComponent } from './components/offer-banner/offer-banner.component';
import { TrustedBrandsComponent } from './components/trusted-brands/trusted-brands.component';

/**
 * Home page.
 *
 * Sections are composed here, each as its own component under `components/`.
 * The hero is eagerly imported because it is the first paint; the sections
 * below the fold could be wrapped in `@defer` once their weight justifies it.
 */
@Component({
  selector: 'app-home',
  imports: [
    HeroComponent,
    CollectionsComponent,
    BestSellersComponent,
    AboutPreviewComponent,
    TrustedBrandsComponent,
    OfferBannerComponent,
    NewsletterBandComponent,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {}
