import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';

/**
 * SSR- and privacy-mode-safe wrapper around Web Storage.
 *
 * `localStorage` is undefined on the server and throws in Safari private mode,
 * so every access is guarded and failures degrade to a no-op rather than
 * breaking a render.
 */
@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly window = inject(DOCUMENT).defaultView;

  get<T>(key: string, fallback: T): T {
    const raw = this.read(key);

    if (raw === null) {
      return fallback;
    }

    try {
      return JSON.parse(raw) as T;
    } catch {
      // Corrupted or non-JSON value left behind by an older build.
      this.remove(key);
      return fallback;
    }
  }

  set<T>(key: string, value: T): void {
    try {
      this.window?.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage unavailable or quota exceeded — nothing actionable for the user.
    }
  }

  remove(key: string): void {
    try {
      this.window?.localStorage.removeItem(key);
    } catch {
      /* no-op */
    }
  }

  private read(key: string): string | null {
    try {
      return this.window?.localStorage.getItem(key) ?? null;
    } catch {
      return null;
    }
  }
}
