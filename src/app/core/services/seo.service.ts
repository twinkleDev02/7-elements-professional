import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRouteSnapshot, RouterStateSnapshot, TitleStrategy } from '@angular/router';

import { environment } from '@env/environment';
import { RouteMeta } from '@shared/models/route-meta.model';
import { APP_NAME, DEFAULT_ROUTE_META } from '@shared/utils/app.constants';

/**
 * Keeps document title, meta description and social tags in sync with the
 * active route.
 *
 * Implemented as a `TitleStrategy` so it runs on every successful navigation
 * without any component having to remember to call it. Routes declare
 * `title: '…'` plus `data: { meta: { … } satisfies RouteMeta }`; everything
 * else falls back to `DEFAULT_ROUTE_META`.
 */
@Injectable({ providedIn: 'root' })
export class SeoService extends TitleStrategy {
  private readonly document = inject(DOCUMENT);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const pageTitle = this.buildTitle(snapshot);
    const routeMeta = this.resolveMeta(snapshot.root);

    this.title.setTitle(pageTitle ? `${pageTitle} | ${APP_NAME}` : DEFAULT_ROUTE_META.title);
    this.applyMeta(pageTitle ?? APP_NAME, routeMeta);
    this.setCanonical(snapshot.url);
  }

  /** Walks to the deepest activated route so child routes can override parents. */
  private resolveMeta(root: ActivatedRouteSnapshot): RouteMeta {
    let current: ActivatedRouteSnapshot | null = root;
    let resolved: RouteMeta = {};

    while (current) {
      const meta = current.data['meta'] as RouteMeta | undefined;

      if (meta) {
        resolved = { ...resolved, ...meta };
      }

      current = current.firstChild;
    }

    return resolved;
  }

  private applyMeta(pageTitle: string, routeMeta: RouteMeta): void {
    const description = routeMeta.description ?? DEFAULT_ROUTE_META.description;
    const image = this.toAbsoluteUrl(routeMeta.image ?? DEFAULT_ROUTE_META.image);

    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'robots', content: routeMeta.robots ?? 'index, follow' });

    this.meta.updateTag({ property: 'og:site_name', content: APP_NAME });
    this.meta.updateTag({ property: 'og:type', content: routeMeta.type ?? 'website' });
    this.meta.updateTag({ property: 'og:title', content: pageTitle });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:image', content: image });

    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: pageTitle });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: image });
  }

  /** Search engines need exactly one canonical URL per page. */
  private setCanonical(url: string): void {
    const href = this.toAbsoluteUrl(url.split('?')[0].split('#')[0]);
    let link = this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }

    link.setAttribute('href', href);
  }

  private toAbsoluteUrl(pathOrUrl: string): string {
    if (/^https?:\/\//i.test(pathOrUrl)) {
      return pathOrUrl;
    }

    return `${environment.siteUrl.replace(/\/$/, '')}/${pathOrUrl.replace(/^\//, '')}`;
  }
}
