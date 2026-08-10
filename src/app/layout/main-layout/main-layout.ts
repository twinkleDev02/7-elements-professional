import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { LoaderService } from '@core/services/loader.service';
import { Footer } from '@layout/footer/footer';
import { Navbar } from '@layout/navbar/navbar';

/**
 * Public site shell: navbar, routed content, footer.
 *
 * Used as the parent `component` of the public routes in `app.routes.ts`, so a
 * second shell (a bare checkout or partner-portal layout, say) can be added
 * later as a sibling route without touching any feature.
 */
@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, Navbar, Footer],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayout {
  /** True while any tracked HTTP request is in flight. */
  protected readonly isLoading = inject(LoaderService).isLoading;
}
