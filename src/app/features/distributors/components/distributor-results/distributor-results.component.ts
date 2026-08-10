import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  effect,
  inject,
  input,
  output,
} from '@angular/core';

import { gsap } from 'gsap';

import { useScrollReveal } from '@shared/animations/scroll-reveal';
import { isBrowser, prefersReducedMotion } from '@shared/utils/platform.util';

import { Distributor, ResultsView } from '../../distributors.model';
import { DistributorCardComponent } from '../distributor-card/distributor-card.component';

const VIEWS: readonly { readonly id: ResultsView; readonly label: string }[] = [
  { id: 'grid', label: 'Grid View' },
  { id: 'list', label: 'List View' },
  { id: 'map', label: 'Map View' },
];

@Component({
  selector: 'app-distributor-results',
  imports: [DistributorCardComponent],
  templateUrl: './distributor-results.component.html',
  styleUrl: './distributor-results.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DistributorResultsComponent {
  private readonly host = inject(ElementRef<HTMLElement>).nativeElement as HTMLElement;

  readonly distributors = input.required<readonly Distributor[]>();
  /** Total across all pages, not just the visible slice. */
  readonly totalCount = input.required<number>();
  readonly view = input<ResultsView>('grid');

  readonly viewChange = output<ResultsView>();
  readonly viewDetails = output<Distributor>();
  readonly directions = output<Distributor>();

  protected readonly views = VIEWS;

  constructor() {
    useScrollReveal(({ q, revealUp }) => {
      revealUp(q('.distributor-results__head'), { y: 18, duration: 0.7 });
      revealUp(q('.distributor-results__item'), {
        y: 30,
        scale: 0.95,
        stagger: 0.07,
        duration: 0.8,
      });
    });

    if (!isBrowser()) {
      return;
    }

    // Re-runs whenever the view or the page changes, so switching layouts and
    // paging both get the same short settle rather than a hard swap.
    effect(() => {
      this.view();
      this.distributors();

      if (prefersReducedMotion()) {
        return;
      }

      queueMicrotask(() => this.playSettle());
    });
  }

  private playSettle(): void {
    const cards = this.host.querySelectorAll('.distributor-results__item');

    if (!cards.length) {
      return;
    }

    gsap.fromTo(
      cards,
      { autoAlpha: 0, y: 16 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.45,
        ease: 'power2.out',
        stagger: 0.035,
        // Without this, GSAP's inline transform outranks the CSS hover lift.
        clearProps: 'transform,opacity,visibility',
      },
    );
  }
}
