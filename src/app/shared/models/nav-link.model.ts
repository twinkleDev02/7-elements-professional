/** A single entry in the primary or footer navigation. */
export interface NavLink {
  readonly label: string;
  /** Router path for internal links, absolute URL for external ones. */
  readonly path: string;
  /** When true, render as a plain anchor with `target="_blank"`. */
  readonly external?: boolean;
  /** Optional icon key resolved by the design system. */
  readonly icon?: string;
}
