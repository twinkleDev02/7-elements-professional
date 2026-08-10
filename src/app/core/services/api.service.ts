import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

/** Query-string values a caller may pass without pre-building `HttpParams`. */
export type QueryParams = Record<string, string | number | boolean | readonly (string | number)[]>;

export interface RequestOptions {
  readonly params?: QueryParams;
  readonly context?: HttpContext;
}

/**
 * Thin, typed facade over `HttpClient`.
 *
 * Feature services depend on this rather than on `HttpClient` directly, so the
 * base URL, param serialisation and cross-cutting concerns stay in one place.
 * Paths passed here are relative (e.g. `'products'`); `apiInterceptor` prefixes
 * them with `environment.apiUrl`.
 */
@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);

  get<T>(path: string, options: RequestOptions = {}): Observable<T> {
    return this.http.get<T>(path, {
      params: toHttpParams(options.params),
      context: options.context,
    });
  }

  post<TResponse, TBody = unknown>(
    path: string,
    body: TBody,
    options: RequestOptions = {},
  ): Observable<TResponse> {
    return this.http.post<TResponse>(path, body, {
      params: toHttpParams(options.params),
      context: options.context,
    });
  }

  put<TResponse, TBody = unknown>(
    path: string,
    body: TBody,
    options: RequestOptions = {},
  ): Observable<TResponse> {
    return this.http.put<TResponse>(path, body, {
      params: toHttpParams(options.params),
      context: options.context,
    });
  }

  patch<TResponse, TBody = unknown>(
    path: string,
    body: TBody,
    options: RequestOptions = {},
  ): Observable<TResponse> {
    return this.http.patch<TResponse>(path, body, {
      params: toHttpParams(options.params),
      context: options.context,
    });
  }

  delete<T>(path: string, options: RequestOptions = {}): Observable<T> {
    return this.http.delete<T>(path, {
      params: toHttpParams(options.params),
      context: options.context,
    });
  }
}

/** Drops null/undefined keys and expands arrays into repeated params. */
function toHttpParams(params?: QueryParams): HttpParams {
  let httpParams = new HttpParams();

  if (!params) {
    return httpParams;
  }

  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined || value === '') {
      continue;
    }

    if (Array.isArray(value)) {
      for (const entry of value) {
        httpParams = httpParams.append(key, String(entry));
      }
    } else {
      httpParams = httpParams.set(key, String(value));
    }
  }

  return httpParams;
}
