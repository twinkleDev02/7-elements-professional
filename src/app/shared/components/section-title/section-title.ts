import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type SectionTitleAlign = 'start' | 'center';
export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

/**
 * Eyebrow / heading / subtitle group that opens a section.
 *
 * `level` is separate from visual size on purpose: the heading rank has to
 * follow the page's document outline for screen readers and SEO, while how
 * large it looks is a design decision. Never skip a level to get a size.
 */
@Component({
  selector: 'app-section-title',
  imports: [],
  templateUrl: './section-title.html',
  styleUrl: './section-title.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionTitle {
  /** Small label above the heading. */
  readonly eyebrow = input<string>();
  readonly title = input.required<string>();
  readonly subtitle = input<string>();

  /** Heading rank. Pick it from the page outline, not from the desired size. */
  readonly level = input<HeadingLevel>(2);
  readonly align = input<SectionTitleAlign>('start');

  /** Renders the eyebrow as a decorative element, hidden from assistive tech. */
  readonly eyebrowDecorative = input(false);
}
