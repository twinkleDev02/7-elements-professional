/**
 * Per-route SEO payload, attached as `data: { meta: { … } satisfies RouteMeta }`
 * and consumed by `SeoService`. Every field is optional — anything omitted
 * falls back to `DEFAULT_ROUTE_META`.
 */
export interface RouteMeta {
  readonly description?: string;
  /** Absolute URL, or a path relative to `environment.siteUrl`. */
  readonly image?: string;
  /** Open Graph object type, e.g. `website` or `product`. */
  readonly type?: string;
  /** Robots directive; set to `noindex, nofollow` for utility pages. */
  readonly robots?: string;
}
