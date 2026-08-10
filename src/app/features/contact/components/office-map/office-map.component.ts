import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { useScrollReveal } from '@shared/animations/scroll-reveal';

import { CONTACT_OFFICE } from '../../contact.data';

@Component({
  selector: 'app-office-map',
  imports: [],
  templateUrl: './office-map.component.html',
  styleUrl: './office-map.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfficeMapComponent {
  private readonly sanitizer = inject(DomSanitizer);

  readonly content = input(CONTACT_OFFICE);

  /**
   * Angular blocks a plain string in an iframe's `src` — a resource URL context
   * — so the embed URL has to be explicitly trusted. Safe here because the
   * value comes from our own config, never from user input.
   */
  protected readonly mapUrl = computed<SafeResourceUrl | null>(() => {
    const url = this.content().mapEmbedUrl;
    return url ? this.sanitizer.bypassSecurityTrustResourceUrl(url) : null;
  });

  constructor() {
    useScrollReveal(({ q, revealUp }) => {
      // Enters from the trailing edge, mirroring the form's leading-edge slide.
      revealUp(q('.office-map__reveal'), { x: 32, y: 0, stagger: 0.09, duration: 0.85 });
    });
  }
}
