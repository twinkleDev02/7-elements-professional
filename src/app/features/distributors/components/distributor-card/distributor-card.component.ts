import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { CATEGORY_OPTIONS } from '../../distributors.data';
import { Distributor } from '../../distributors.model';

const STAR_SLOTS = [1, 2, 3, 4, 5] as const;

const TIER_LABEL: Readonly<Record<string, string>> = {
  gold: 'Gold Partner',
  silver: 'Silver Partner',
  bronze: 'Bronze Partner',
};

@Component({
  selector: 'app-distributor-card',
  imports: [],
  templateUrl: './distributor-card.component.html',
  styleUrl: './distributor-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DistributorCardComponent {
  readonly distributor = input.required<Distributor>();
  /** `list` renders the same data in a horizontal row. */
  readonly layout = input<'grid' | 'list'>('grid');

  readonly viewDetails = output<Distributor>();
  readonly directions = output<Distributor>();

  protected readonly stars = STAR_SLOTS;

  protected readonly tierLabel = computed(() => TIER_LABEL[this.distributor().tier] ?? 'Partner');

  /** First letter of the business name, used as the logo stand-in. */
  protected readonly initial = computed(() => this.distributor().name.charAt(0).toUpperCase());

  protected readonly ratingWidth = computed(() => (this.distributor().rating / 5) * 100);

  /** Product ids resolved to their display labels. */
  protected readonly productLabels = computed(() =>
    this.distributor().products.map(
      (id) => CATEGORY_OPTIONS.find((option) => option.value === id)?.label ?? id,
    ),
  );
}
