import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';

import { CATEGORY_OPTIONS, SERVICE_OPTIONS, STATE_OPTIONS } from '../../distributors.data';
import { SelectOption } from '../../distributors.model';

/** Which facet changed, and its new selection. */
export interface FacetChange {
  readonly facet: 'states' | 'categories' | 'services';
  readonly values: readonly string[];
}

/**
 * Filter sidebar.
 *
 * Groups are native `<details>` elements: keyboard behaviour, screen-reader
 * semantics and the open/close animation hook all come from the platform, so
 * no accordion state has to be tracked here.
 */
@Component({
  selector: 'app-distributor-filter',
  imports: [],
  templateUrl: './distributor-filter.component.html',
  styleUrl: './distributor-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DistributorFilterComponent {
  readonly states = input<readonly SelectOption[]>(STATE_OPTIONS);
  readonly categories = input<readonly SelectOption[]>(CATEGORY_OPTIONS);
  readonly services = input<readonly SelectOption[]>(SERVICE_OPTIONS);

  readonly selectedStates = input<readonly string[]>([]);
  readonly selectedCategories = input<readonly string[]>([]);
  readonly selectedServices = input<readonly string[]>([]);

  readonly facetChange = output<FacetChange>();
  readonly clearAll = output<void>();

  /** Drawer state below `lg`, where the sidebar would otherwise dominate. */
  protected readonly isOpen = signal(false);

  protected toggleDrawer(): void {
    this.isOpen.update((open) => !open);
  }

  protected isChecked(selected: readonly string[], value: string): boolean {
    return selected.includes(value);
  }

  protected onToggle(
    facet: FacetChange['facet'],
    selected: readonly string[],
    value: string,
  ): void {
    const values = selected.includes(value)
      ? selected.filter((entry) => entry !== value)
      : [...selected, value];

    this.facetChange.emit({ facet, values });
  }
}
