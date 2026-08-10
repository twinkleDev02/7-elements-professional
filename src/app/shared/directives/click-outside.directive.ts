import { DOCUMENT } from '@angular/common';
import { DestroyRef, Directive, ElementRef, inject, output } from '@angular/core';

import { isBrowser } from '@shared/utils/platform.util';

/**
 * Emits when a pointer or focus event lands outside the host element.
 *
 * Used to dismiss the mobile menu, mini-cart and any other transient panel:
 *
 * ```html
 * <div class="menu" (appClickOutside)="close()">…</div>
 * ```
 *
 * The listener is attached in the capture phase so it still fires when an inner
 * handler stops propagation.
 */
@Directive({
  selector: '[appClickOutside]',
})
export class ClickOutsideDirective {
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly document = inject(DOCUMENT);

  readonly appClickOutside = output<Event>();

  constructor() {
    if (!isBrowser()) {
      return;
    }

    const onDocumentEvent = (event: Event) => {
      const target = event.target as Node | null;

      if (target && !this.host.nativeElement.contains(target)) {
        this.appClickOutside.emit(event);
      }
    };

    this.document.addEventListener('pointerdown', onDocumentEvent, true);
    this.document.addEventListener('focusin', onDocumentEvent, true);

    inject(DestroyRef).onDestroy(() => {
      this.document.removeEventListener('pointerdown', onDocumentEvent, true);
      this.document.removeEventListener('focusin', onDocumentEvent, true);
    });
  }
}
