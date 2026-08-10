import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

import { environment } from '@env/environment';
import { ApiError } from '@shared/models/api-response.model';

const GENERIC_MESSAGE = 'Something went wrong. Please try again.';

const STATUS_MESSAGES: Readonly<Record<number, string>> = {
  0: 'We could not reach the server. Check your connection and try again.',
  400: 'Some of the details provided are not valid.',
  401: 'Your session has expired. Please sign in again.',
  403: 'You do not have permission to do that.',
  404: 'We could not find what you were looking for.',
  409: 'That action conflicts with the current state. Refresh and try again.',
  422: 'Some of the details provided are not valid.',
  429: 'Too many requests. Please wait a moment and try again.',
  500: GENERIC_MESSAGE,
  503: 'The service is temporarily unavailable. Please try again shortly.',
};

/**
 * Converts every `HttpErrorResponse` into an `ApiError`, so nothing downstream
 * has to know about HTTP and no raw backend text ever reaches a visitor.
 *
 * Must be registered **last** in the interceptor chain — it is the outermost
 * `catchError`, and anything registered after it would bypass normalisation.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) =>
  next(req).pipe(
    catchError((response: HttpErrorResponse) => {
      const apiError = toApiError(response);

      if (environment.enableDebugTools) {
        console.error(`[api] ${req.method} ${req.urlWithParams} failed`, response);
      }

      return throwError(() => apiError);
    }),
  );

function toApiError(response: HttpErrorResponse): ApiError {
  const body = response.error as Record<string, unknown> | string | null;
  const fromBody = typeof body === 'object' && body !== null ? body : null;

  return {
    status: response.status,
    message:
      (typeof fromBody?.['message'] === 'string' ? (fromBody['message'] as string) : undefined) ??
      STATUS_MESSAGES[response.status] ??
      GENERIC_MESSAGE,
    code: typeof fromBody?.['code'] === 'string' ? (fromBody['code'] as string) : undefined,
    fieldErrors: (fromBody?.['errors'] as Record<string, string> | undefined) ?? undefined,
  };
}
