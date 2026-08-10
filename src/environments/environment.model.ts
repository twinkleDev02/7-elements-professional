/**
 * Shape shared by every environment file, so a missing or misspelled key in one
 * build configuration fails at compile time rather than at runtime.
 */
export interface AppEnvironment {
  /** True only for optimized production builds. */
  readonly production: boolean;
  /** Base URL prepended to every relative request by the api interceptor. */
  readonly apiUrl: string;
  /** Canonical origin, used to build absolute URLs for SEO/social tags. */
  readonly siteUrl: string;
  /** Enables verbose logging and other developer-only affordances. */
  readonly enableDebugTools: boolean;
}
