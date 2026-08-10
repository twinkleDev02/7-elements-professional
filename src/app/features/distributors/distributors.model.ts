/** Partner tiers, in descending order of standing. */
export type PartnerTier = 'gold' | 'silver' | 'bronze';

/** How the results are laid out. */
export type ResultsView = 'grid' | 'list' | 'map';

export interface Distributor {
  readonly id: string;
  readonly name: string;
  readonly city: string;
  readonly state: string;
  readonly tier: PartnerTier;
  readonly rating: number;
  readonly reviewCount: number;
  readonly phone: string;
  readonly email: string;
  /** Product range ids this distributor carries. */
  readonly products: readonly string[];
  /** Districts or regions served, shown on the card. */
  readonly coverage: string;
  /** Services offered, used by the sidebar filters. */
  readonly services: readonly string[];
  readonly pincode: string;
}

/**
 * The full filter state for the results list.
 *
 * State and product category appear only as sidebar multi-selects — the top
 * panel used to duplicate them as single selects, which gave the same question
 * two answers.
 */
export interface DistributorFilter {
  /** Top search panel. */
  readonly city: string;
  readonly pincode: string;
  /** Sidebar multi-selects. Empty means "no restriction". */
  readonly states: readonly string[];
  readonly categories: readonly string[];
  readonly services: readonly string[];
}

export const EMPTY_FILTER: DistributorFilter = {
  city: '',
  pincode: '',
  states: [],
  categories: [],
  services: [],
};

/** Payload posted by the become-a-distributor form. */
export interface DistributorApplication {
  readonly fullName: string;
  readonly businessName: string;
  readonly email: string;
  readonly mobile: string;
  readonly alternateNumber?: string;
  readonly state: string;
  readonly city: string;
  readonly pincode: string;
  readonly dateOfBirth: string;
  readonly gender: string;
  readonly businessType: string;
  readonly address: string;
  readonly gstNumber?: string;
  readonly yearsInBusiness: string;
  readonly reason: string;
  /** File names only; the upload itself is a separate multipart request. */
  readonly documents: readonly string[];
  readonly acceptedTerms: boolean;
}

/** A labelled option for a select control. */
export interface SelectOption {
  readonly value: string;
  readonly label: string;
}

/** An icon paired with a two-line label. */
export interface DistributorBenefit {
  readonly id: string;
  readonly title: string;
  readonly subtitle: string;
  readonly iconPaths: readonly string[];
}

/** One step of the registration progress indicator. */
export interface FormStep {
  readonly id: string;
  readonly label: string;
}
