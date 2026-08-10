import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { ROUTES } from '@shared/utils/app.constants';
import { toSlug } from '@shared/utils/string.util';

import { DistributorFilterComponent, FacetChange } from './components/distributor-filter/distributor-filter.component';
import { DistributorHeroComponent } from './components/distributor-hero/distributor-hero.component';
import { DistributorPaginationComponent } from './components/distributor-pagination/distributor-pagination.component';
import { DistributorResultsComponent } from './components/distributor-results/distributor-results.component';
import { DistributorSearchComponent, SearchCriteria } from './components/distributor-search/distributor-search.component';
import { DISTRIBUTORS, DISTRIBUTORS_PER_PAGE, FIND_HERO } from './distributors.data';
import { Distributor, DistributorFilter, EMPTY_FILTER, ResultsView } from './distributors.model';

/**
 * Find a Distributor.
 *
 * Owns the filter, view and page state so the search panel, sidebar, results
 * and pagination can never disagree. Every section below stays presentational:
 * data in, events out.
 *
 * The list is a local array today; swapping it for an API response means
 * replacing `source` and nothing else.
 */
@Component({
  selector: 'app-find-distributor',
  imports: [
    DistributorHeroComponent,
    DistributorSearchComponent,
    DistributorFilterComponent,
    DistributorResultsComponent,
    DistributorPaginationComponent,
  ],
  templateUrl: './find-distributor.html',
  styleUrl: './find-distributor.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FindDistributor {
  private readonly router = inject(Router);
  private readonly source: readonly Distributor[] = DISTRIBUTORS;

  protected readonly hero = FIND_HERO;

  protected readonly filter = signal<DistributorFilter>(EMPTY_FILTER);
  protected readonly view = signal<ResultsView>('grid');
  protected readonly page = signal(1);

  protected readonly matches = computed<readonly Distributor[]>(() => {
    const current = this.filter();

    return this.source.filter((distributor) => this.isMatch(distributor, current));
  });

  protected readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.matches().length / DISTRIBUTORS_PER_PAGE)),
  );

  protected readonly visible = computed(() => {
    const start = (this.page() - 1) * DISTRIBUTORS_PER_PAGE;
    return this.matches().slice(start, start + DISTRIBUTORS_PER_PAGE);
  });

  // ---------------------------------------------------------------------------
  // Filtering
  // ---------------------------------------------------------------------------

  private isMatch(distributor: Distributor, filter: DistributorFilter): boolean {
    // The record stores a display name; the select stores a slug.
    if (filter.city && toSlug(distributor.city) !== filter.city) {
      return false;
    }

    if (filter.pincode && !distributor.pincode.startsWith(filter.pincode)) {
      return false;
    }

    // Sidebar facets are OR within a group, AND across groups. An empty group
    // means "no restriction" rather than "match nothing".
    if (filter.states.length && !filter.states.includes(distributor.state)) {
      return false;
    }

    if (
      filter.categories.length &&
      !filter.categories.some((id) => distributor.products.includes(id))
    ) {
      return false;
    }

    if (
      filter.services.length &&
      !filter.services.some((id) => distributor.services.includes(id))
    ) {
      return false;
    }

    return true;
  }

  // ---------------------------------------------------------------------------
  // Events
  // ---------------------------------------------------------------------------

  protected onSearch(criteria: SearchCriteria): void {
    this.filter.update((current) => ({ ...current, ...criteria }));
    this.resetPage();
  }

  protected onSearchReset(): void {
    this.filter.set(EMPTY_FILTER);
    this.resetPage();
  }

  protected onFacetChange(change: FacetChange): void {
    this.filter.update((current) => ({ ...current, [change.facet]: change.values }));
    this.resetPage();
  }

  protected onClearFacets(): void {
    this.filter.update((current) => ({ ...current, states: [], categories: [], services: [] }));
    this.resetPage();
  }

  protected onViewChange(view: ResultsView): void {
    this.view.set(view);
  }

  protected onPageChange(page: number): void {
    this.page.set(page);
  }

  protected onBecomeDistributor(): void {
    void this.router.navigate([`/${ROUTES.becomeDistributor}`]);
  }

  protected onFindDistributor(): void {
    // Jumps to the search panel rather than navigating — it is already here.
    document.getElementById('distributor-search')?.scrollIntoView({ behavior: 'smooth' });
  }

  protected onViewDetails(distributor: Distributor): void {
    // TODO: open the distributor detail view once that design exists.
    void distributor;
  }

  protected onDirections(distributor: Distributor): void {
    // Hands off to whichever maps app the visitor's device prefers, rather
    // than assuming a provider.
    const query = encodeURIComponent(`${distributor.name}, ${distributor.city}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank', 'noopener');
  }

  /** A filter change almost never leaves the visitor on a valid deep page. */
  private resetPage(): void {
    this.page.set(1);
  }
}
