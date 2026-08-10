/** Converts a display name into a URL-safe slug. */
export function toSlug(value: string): string {
  return value
    .normalize('NFD')
    // Strip the combining diacritical marks NFD just split off.
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Truncates on a word boundary, appending an ellipsis when it cuts. */
export function truncate(value: string, maxLength: number): string {
  if (value.length <= maxLength) {
    return value;
  }

  const clipped = value.slice(0, maxLength);
  const lastSpace = clipped.lastIndexOf(' ');

  return `${lastSpace > 0 ? clipped.slice(0, lastSpace) : clipped}…`;
}

/** Formats a price for display in the visitor's locale. */
export function formatPrice(amount: number, currency: string, locale = 'en-IN'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}
