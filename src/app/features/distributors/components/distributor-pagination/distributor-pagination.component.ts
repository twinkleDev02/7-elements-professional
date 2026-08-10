import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

/** `null` marks an ellipsis gap rather than a page. */
type PageSlot = number | null;

/** Pages always shown either side of the current one. */
const WINDOW = 1;

@Component({
  selector: 'app-distributor-pagination',
  imports: [],
  templateUrl: './distributor-pagination.component.html',
  styleUrl: './distributor-pagination.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DistributorPaginationComponent {
  readonly currentPage = input.required<number>();
  readonly totalPages = input.required<number>();

  readonly pageChange = output<number>();

  protected readonly canPrev = computed(() => this.currentPage() > 1);
  protected readonly canNext = computed(() => this.currentPage() < this.totalPages());

  /**
   * First page, last page, and a window around the current one — with gaps
   * collapsed to a single ellipsis, so the control stays a fixed width however
   * many pages exist.
   */
  protected readonly slots = computed<readonly PageSlot[]>(() => {
    const total = this.totalPages();
    const current = this.currentPage();

    if (total <= 1) {
      return [];
    }

    const pages = new Set<number>([1, total]);

    for (let page = current - WINDOW; page <= current + WINDOW; page++) {
      if (page >= 1 && page <= total) {
        pages.add(page);
      }
    }

    const ordered = [...pages].sort((a, b) => a - b);
    const slots: PageSlot[] = [];

    ordered.forEach((page, index) => {
      const previous = ordered[index - 1];

      if (previous !== undefined && page - previous > 1) {
        slots.push(null);
      }

      slots.push(page);
    });

    return slots;
  });

  protected go(page: number): void {
    if (page < 1 || page > this.totalPages() || page === this.currentPage()) {
      return;
    }

    this.pageChange.emit(page);
  }
}
