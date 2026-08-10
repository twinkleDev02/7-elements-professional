import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from '@angular/core';

import { ProductDetail } from '../../product-detail.data';

type TabId = 'description' | 'how-to-use' | 'ingredients' | 'faq';

interface TabDefinition {
  readonly id: TabId;
  readonly label: string;
}

const TABS: readonly TabDefinition[] = [
  { id: 'description', label: 'Description' },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'ingredients', label: 'Ingredients' },
  { id: 'faq', label: 'FAQ' },
];

/**
 * Description / How to Use / Ingredients / FAQ.
 *
 * Implements the ARIA tabs pattern: arrow keys move between tabs, and only the
 * active tab is in the tab order — so a keyboard user steps past the whole
 * strip in one press rather than four.
 */
@Component({
  selector: 'app-product-tabs',
  imports: [],
  templateUrl: './product-tabs.component.html',
  styleUrl: './product-tabs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductTabsComponent {
  readonly product = input.required<ProductDetail>();

  protected readonly tabs = TABS;
  protected readonly activeId = signal<TabId>('description');
  protected readonly activeIndex = computed(() =>
    this.tabs.findIndex((tab) => tab.id === this.activeId()),
  );

  protected select(id: TabId): void {
    this.activeId.set(id);
  }

  /** Roving focus across the tab strip, per the ARIA tabs pattern. */
  protected onKeydown(event: KeyboardEvent, index: number): void {
    const lastIndex = this.tabs.length - 1;
    let nextIndex: number | null = null;

    switch (event.key) {
      case 'ArrowRight':
        nextIndex = index === lastIndex ? 0 : index + 1;
        break;
      case 'ArrowLeft':
        nextIndex = index === 0 ? lastIndex : index - 1;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = lastIndex;
        break;
      default:
        return;
    }

    event.preventDefault();

    const nextTab = this.tabs[nextIndex];
    this.activeId.set(nextTab.id);

    // Focus follows selection in an automatic-activation tab strip.
    const strip = event.currentTarget as HTMLElement;
    const buttons = strip.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    buttons?.[nextIndex]?.focus();
  }
}
