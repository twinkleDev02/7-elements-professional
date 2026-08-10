import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Collection } from '@shared/models/collection.model';
import { ROUTES } from '@shared/utils/app.constants';

/**
 * Editorial tile linking into a collection. Larger and image-led compared with
 * `ProductCard`, which is a listing unit.
 */
@Component({
  selector: 'app-collection-card',
  imports: [RouterLink],
  templateUrl: './collection-card.html',
  styleUrl: './collection-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionCard {
  readonly collection = input.required<Collection>();

  /** Set on tiles above the fold; see the note on `ProductCard.eager`. */
  readonly eager = input(false);

  /** Emphasised treatment for a lead tile in an asymmetric grid. */
  readonly featured = input(false);

  readonly ctaLabel = input('Explore');

  protected readonly link = computed(() => `/${ROUTES.products}/${this.collection().slug}`);

  protected readonly countLabel = computed(() => {
    const count = this.collection().productCount;

    if (!count) {
      return null;
    }

    return `${count} ${count === 1 ? 'product' : 'products'}`;
  });
}
