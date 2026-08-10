import { ContactTopic } from '@shared/models/contact-request.model';
import { BRAND_CONTACT } from '@shared/utils/app.constants';

/**
 * Content for the Contact page.
 *
 * !! CONTACT DETAILS ARE PLACEHOLDERS !!
 * The catalogue does not publish a phone number, street address or public
 * mailbox, and inventing business contact data is worse than leaving it
 * obviously unfinished. The phone number below is deliberately `00000 00000` so
 * it cannot be mistaken for real, and the email is derived from
 * `environment.siteUrl` rather than known to exist.
 *
 * Replace every value marked TODO before launch.
 */

export interface ContactChannel {
  readonly id: string;
  readonly label: string;
  /** Primary line, e.g. the number or address. */
  readonly value: string;
  /** Supporting line beneath it. */
  readonly caption: string;
  /** `tel:`/`mailto:` target, or undefined for a non-actionable card. */
  readonly href?: string;
  readonly iconPaths: readonly string[];
}

export interface TopicOption {
  readonly id: ContactTopic;
  readonly label: string;
}

export interface TrustPoint {
  readonly id: string;
  readonly title: string;
  readonly subtitle: string;
  readonly iconPaths: readonly string[];
}

// -----------------------------------------------------------------------------
// Glyphs
// -----------------------------------------------------------------------------

const ICON = {
  phone: [
    'M7.2 3.5 9 3.9l1.2 3.4-1.9 1.5a11.5 11.5 0 0 0 5.9 5.9l1.5-1.9 3.4 1.2.4 1.8a2 2 0 0 1-2 2.3A15.6 15.6 0 0 1 4.9 5.5a2 2 0 0 1 2.3-2z',
  ],
  mail: ['M3.5 6h17v12h-17z', 'M3.5 6.5l8.5 6 8.5-6'],
  pin: [
    'M12 21s6.5-5.6 6.5-10.2a6.5 6.5 0 0 0-13 0C5.5 15.4 12 21 12 21z',
    'M12 8.2a2.6 2.6 0 1 1 0 5.2 2.6 2.6 0 0 1 0-5.2z',
  ],
  clock: ['M12 3.5a8.5 8.5 0 1 1 0 17 8.5 8.5 0 0 1 0-17z', 'M12 7.5V12l3 1.8'],
  person: ['M12 4a3.2 3.2 0 1 1 0 6.4A3.2 3.2 0 0 1 12 4z', 'M5.5 20.5a6.5 6.5 0 0 1 13 0'],
  shieldCheck: [
    'M12 3.2 19 6v6c0 4.2-2.9 7.4-7 8.8-4.1-1.4-7-4.6-7-8.8V6z',
    'M9 12.2l2.1 2.1L15.5 10',
  ],
  globe: [
    'M12 3.5a8.5 8.5 0 1 1 0 17 8.5 8.5 0 0 1 0-17z',
    'M3.5 12h17',
    'M12 3.5c2.2 2.4 3.4 5.3 3.4 8.5S14.2 18.1 12 20.5c-2.2-2.4-3.4-5.3-3.4-8.5S9.8 5.9 12 3.5z',
  ],
  flask: ['M10 3h4v3.4l3.2 5.4a3 3 0 0 1-2.6 4.5H9.4a3 3 0 0 1-2.6-4.5L10 6.4z', 'M8.5 14h7'],
} as const;

// -----------------------------------------------------------------------------
// Hero
// -----------------------------------------------------------------------------

export const CONTACT_HERO = {
  eyebrow: 'Contact 7 Elements Professional',
  titleLines: ['Let’s Talk About', 'Your Salon'],
  body:
    'Partnership enquiries, wholesale orders and product support — tell us what you ' +
    'need and the right person will come back to you.',
  // TODO: verify this render suits the Contact hero. Swap the path if a
  // dedicated asset is produced.
  imageAlt: '7 Elements Professional product range',
} as const;

// -----------------------------------------------------------------------------
// Contact channels
// -----------------------------------------------------------------------------

export const CONTACT_CHANNELS: readonly ContactChannel[] = [
  {
    id: 'phone',
    label: 'Call Us',
    // TODO: replace with the real number, in `BRAND_CONTACT`.
    value: BRAND_CONTACT.phone,
    caption: BRAND_CONTACT.hours,
    href: BRAND_CONTACT.phoneHref,
    iconPaths: ICON.phone,
  },
  {
    id: 'email',
    label: 'Email Us',
    // TODO: confirm this mailbox exists. Derived from environment.siteUrl.
    value: BRAND_CONTACT.email,
    caption: 'We reply within one working day',
    href: BRAND_CONTACT.emailHref,
    iconPaths: ICON.mail,
  },
  {
    id: 'address',
    label: 'Visit Us',
    // Company name is from the catalogue; the address is not published.
    value: BRAND_CONTACT.company,
    // TODO: add the registered street address.
    caption: 'Address to be confirmed',
    iconPaths: ICON.pin,
  },
  {
    id: 'hours',
    label: 'Working Hours',
    // TODO: confirm trading hours.
    value: 'Mon – Sat',
    caption: '10:00 – 19:00 IST',
    iconPaths: ICON.clock,
  },
];

// -----------------------------------------------------------------------------
// Enquiry form
// -----------------------------------------------------------------------------

export const CONTACT_FORM = {
  eyebrow: 'Send An Enquiry',
  title: 'Tell Us How We Can Help',
  body:
    'Complete the form and our team will route your enquiry to the right specialist.',
  submitLabel: 'Send Enquiry',
} as const;

export const CONTACT_TOPICS: readonly TopicOption[] = [
  { id: 'salon-partnership', label: 'Salon Partnership' },
  { id: 'wholesale', label: 'Wholesale Order' },
  { id: 'support', label: 'Product Support' },
  { id: 'press', label: 'Press & Media' },
  { id: 'general', label: 'General Enquiry' },
];

// -----------------------------------------------------------------------------
// Office panel
// -----------------------------------------------------------------------------

export const CONTACT_OFFICE = {
  eyebrow: 'Our Office',
  title: 'Redefining Salon Artistry Private Limited',
  body:
    '7 Elements Professional is distributed through authorised salon partners only. ' +
    'Get in touch and we will connect you with your nearest stockist.',
  // TODO: add the registered address, then set `mapEmbedUrl` or a static map
  // image. The map container renders blank until one is supplied.
  addressLines: [] as readonly string[],
  mapEmbedUrl: '' as string,
} as const;

// -----------------------------------------------------------------------------
// Trust banner
// -----------------------------------------------------------------------------

export const CONTACT_TRUST = {
  eyebrow: 'Why Salons Choose Us',
  titleLines: ['A Professional Partner,', 'Not Just A Supplier'],
  body:
    'Training, technical support and a range built for the chair — backed by French ' +
    'formulation technology.',
  image: 'assets/images/collections/nano-plex.png',
  imageAlt: 'The 7 Elements Professional range',
} as const;

export const CONTACT_TRUST_POINTS: readonly TrustPoint[] = [
  { id: 'salon', title: 'Salon Trusted', subtitle: 'Professional Channel', iconPaths: ICON.person },
  { id: 'formulation', title: 'French Formulation', subtitle: 'Advanced Technology', iconPaths: ICON.flask },
  { id: 'safe', title: 'Safe & Certified', subtitle: 'GMP · ISO', iconPaths: ICON.shieldCheck },
  { id: 'reach', title: '25+ Countries', subtitle: 'Worldwide Presence', iconPaths: ICON.globe },
];
