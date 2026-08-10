import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { HeadingLevel } from '@shared/components/section-title/section-title';

/**
 * Small editorial card for a benefit, ingredient or one of the seven elements.
 *
 * Text-led rather than image-led. Anything richer than a paragraph goes in via
 * content projection rather than growing the input list.
 */
@Component({
  selector: 'app-feature-card',
  imports: [RouterLink],
  templateUrl: './feature-card.html',
  styleUrl: './feature-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureCard {
  /** Icon key resolved by the design system, or an image URL. */
  readonly icon = input<string>();
  /** Numeral or short label above the title — `01`, `Element I`. */
  readonly eyebrow = input<string>();

  readonly title = input.required<string>();
  readonly description = input<string>();

  /** Heading rank; pick it from the page outline. See `SectionTitle.level`. */
  readonly level = input<HeadingLevel>(3);

  /** Optional internal route. Renders a link only when set. */
  readonly link = input<string>();
  readonly linkLabel = input('Read more');
}
