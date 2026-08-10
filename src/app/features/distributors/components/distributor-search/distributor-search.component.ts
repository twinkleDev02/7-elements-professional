import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { useScrollReveal } from '@shared/animations/scroll-reveal';

import { CITY_OPTIONS } from '../../distributors.data';
import { SelectOption } from '../../distributors.model';

/** The two fields of the top search panel. */
export interface SearchCriteria {
  readonly city: string;
  readonly pincode: string;
}

@Component({
  selector: 'app-distributor-search',
  imports: [FormsModule],
  templateUrl: './distributor-search.component.html',
  styleUrl: './distributor-search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DistributorSearchComponent {
  /**
   * The states currently ticked in the sidebar. This panel no longer asks for
   * a state itself, but it still needs to know which ones are in play so the
   * city list stays relevant.
   */
  readonly states = input<readonly string[]>([]);

  readonly search = output<SearchCriteria>();
  readonly reset = output<void>();

  protected readonly city = signal('');
  protected readonly pincode = signal('');

  /** Cities of the chosen states, or every city while no state is chosen. */
  protected readonly cities = computed<readonly SelectOption[]>(() => {
    const chosen = this.states();
    const groups = chosen.length
      ? chosen.map((state) => CITY_OPTIONS[state] ?? [])
      : Object.values(CITY_OPTIONS);

    // Two states can offer the same city name; the select must not list it
    // twice, and keying by value collapses the duplicates.
    const byValue = new Map<string, SelectOption>();

    for (const option of groups.flat()) {
      byValue.set(option.value, option);
    }

    return [...byValue.values()];
  });

  constructor() {
    useScrollReveal(({ q, revealUp }) => {
      revealUp(q('.distributor-search__panel'), { y: 28, duration: 0.85 });
      revealUp(q('.distributor-search__field'), { y: 16, stagger: 0.06, duration: 0.6 });
    });
  }

  protected onSearch(): void {
    this.search.emit({
      city: this.city(),
      pincode: this.pincode().trim(),
    });
  }

  protected onReset(): void {
    this.city.set('');
    this.pincode.set('');
    this.reset.emit();
  }
}
