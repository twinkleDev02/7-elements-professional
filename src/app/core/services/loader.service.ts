import { Injectable, computed, signal } from '@angular/core';

/**
 * Tracks how many HTTP requests are currently in flight so the shell can show a
 * single global progress indicator. A counter (rather than a boolean) keeps
 * overlapping requests from hiding the indicator early.
 *
 * Driven by `loadingInterceptor` — components should read `isLoading`, not call
 * `start`/`stop` directly.
 */
@Injectable({ providedIn: 'root' })
export class LoaderService {
  private readonly pending = signal(0);

  /** True while at least one tracked request is outstanding. */
  readonly isLoading = computed(() => this.pending() > 0);

  start(): void {
    this.pending.update((count) => count + 1);
  }

  stop(): void {
    this.pending.update((count) => Math.max(0, count - 1));
  }

  /** Escape hatch for error recovery; avoid in normal flows. */
  reset(): void {
    this.pending.set(0);
  }
}
