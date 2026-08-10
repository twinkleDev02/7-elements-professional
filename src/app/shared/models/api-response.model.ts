/** Envelope returned by list endpoints. */
export interface Paginated<T> {
  readonly items: readonly T[];
  readonly page: number;
  readonly pageSize: number;
  readonly total: number;
}

/**
 * Normalised failure shape produced by `errorInterceptor`. Components and
 * services only ever see this — never a raw `HttpErrorResponse`.
 */
export interface ApiError {
  /** HTTP status, or 0 when the request never reached the server. */
  readonly status: number;
  /** Message safe to surface to a visitor. */
  readonly message: string;
  /** Machine-readable code from the backend, when it supplies one. */
  readonly code?: string;
  /** Field-level validation messages, keyed by form control name. */
  readonly fieldErrors?: Readonly<Record<string, string>>;
}

/** Discriminated union for representing an async value in a template. */
export type RequestState<T> =
  | { readonly status: 'idle' }
  | { readonly status: 'loading' }
  | { readonly status: 'success'; readonly data: T }
  | { readonly status: 'error'; readonly error: ApiError };
