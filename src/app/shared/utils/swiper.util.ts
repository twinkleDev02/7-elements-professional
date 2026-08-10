import { register } from 'swiper/element/bundle';

let registered = false;

/**
 * Defines Swiper's custom elements exactly once.
 *
 * `register()` calls `customElements.define`, which throws if the same tag is
 * defined twice — so a page holding two Swipers, or a route revisited, would
 * break without this guard. Also a no-op where `customElements` does not exist,
 * which keeps it safe on the server.
 *
 * Components using `<swiper-container>` must call this and declare
 * `schemas: [CUSTOM_ELEMENTS_SCHEMA]`, or Angular rejects the unknown tag.
 */
export function registerSwiperElements(): void {
  if (registered || typeof customElements === 'undefined') {
    return;
  }

  register();
  registered = true;
}
