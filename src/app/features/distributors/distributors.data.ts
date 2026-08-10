import {
  Distributor,
  DistributorBenefit,
  FormStep,
  SelectOption,
} from './distributors.model';

/**
 * Content and seed data for the distributor pages.
 *
 * !! DISTRIBUTOR RECORDS ARE SEED DATA !!
 * Names, numbers and mailboxes follow the reference design and are not real
 * businesses. The list is typed and array-backed precisely so it can be swapped
 * for an API response without touching a template — see `DistributorService`.
 */

// -----------------------------------------------------------------------------
// Glyphs
// -----------------------------------------------------------------------------

const ICON = {
  margin: [
    'M12 3.5a8.5 8.5 0 1 1 0 17 8.5 8.5 0 0 1 0-17z',
    'M9.8 14.6c.4.9 1.3 1.4 2.3 1.4 1.3 0 2.3-.8 2.3-1.9 0-2.5-4.4-1.5-4.4-4 0-1.1 1-1.9 2.3-1.9 1 0 1.9.5 2.3 1.4',
    'M12 6.4v11.2',
  ],
  territory: [
    'M12 21s6.5-5.6 6.5-10.2a6.5 6.5 0 0 0-13 0C5.5 15.4 12 21 12 21z',
    'M12 8.2a2.6 2.6 0 1 1 0 5.2 2.6 2.6 0 0 1 0-5.2z',
  ],
  marketing: [
    'M4 9.5h3.5L14 5.5v13L7.5 14.5H4z',
    'M17 9.2a4 4 0 0 1 0 5.6',
    'M19.5 6.8a7.5 7.5 0 0 1 0 10.4',
  ],
  training: [
    'M12 4.5 21 9l-9 4.5L3 9z',
    'M6.5 11v4.6c0 1.6 2.5 2.9 5.5 2.9s5.5-1.3 5.5-2.9V11',
  ],
  launch: [
    'M14.5 3.5c3 0 6 3 6 6-1.9 3.6-4.6 6.3-8.2 8.2l-2.7-2.7-2.7-2.7C8.8 8.7 11.5 6 14.5 3.5z',
    'M8.9 15.1 5.5 18.5',
    'M15.2 8.8h.01',
  ],
  growth: [
    'M4 19.5h16',
    'M6.5 19.5v-5M11 19.5v-9M15.5 19.5v-6M20 19.5v-11',
  ],
  phone: [
    'M7.2 3.5 9 3.9l1.2 3.4-1.9 1.5a11.5 11.5 0 0 0 5.9 5.9l1.5-1.9 3.4 1.2.4 1.8a2 2 0 0 1-2 2.3A15.6 15.6 0 0 1 4.9 5.5a2 2 0 0 1 2.3-2z',
  ],
  mail: ['M3.5 6h17v12h-17z', 'M3.5 6.5l8.5 6 8.5-6'],
} as const;

export const DISTRIBUTOR_ICONS = ICON;

// -----------------------------------------------------------------------------
// Filter options
// -----------------------------------------------------------------------------

export const STATE_OPTIONS: readonly SelectOption[] = [
  { value: 'maharashtra', label: 'Maharashtra' },
  { value: 'delhi', label: 'Delhi' },
  { value: 'karnataka', label: 'Karnataka' },
  { value: 'gujarat', label: 'Gujarat' },
  { value: 'tamil-nadu', label: 'Tamil Nadu' },
  { value: 'telangana', label: 'Telangana' },
  { value: 'west-bengal', label: 'West Bengal' },
  { value: 'rajasthan', label: 'Rajasthan' },
];

/** Cities keyed by state, so the city select narrows with the state. */
export const CITY_OPTIONS: Readonly<Record<string, readonly SelectOption[]>> = {
  maharashtra: [
    { value: 'mumbai', label: 'Mumbai' },
    { value: 'pune', label: 'Pune' },
    { value: 'nagpur', label: 'Nagpur' },
  ],
  delhi: [
    { value: 'delhi', label: 'Delhi' },
    { value: 'new-delhi', label: 'New Delhi' },
  ],
  karnataka: [
    { value: 'bangalore', label: 'Bangalore' },
    { value: 'mysore', label: 'Mysore' },
  ],
  gujarat: [
    { value: 'ahmedabad', label: 'Ahmedabad' },
    { value: 'surat', label: 'Surat' },
  ],
  'tamil-nadu': [
    { value: 'chennai', label: 'Chennai' },
    { value: 'coimbatore', label: 'Coimbatore' },
  ],
  telangana: [{ value: 'hyderabad', label: 'Hyderabad' }],
  'west-bengal': [{ value: 'kolkata', label: 'Kolkata' }],
  rajasthan: [{ value: 'jaipur', label: 'Jaipur' }],
};

export const CATEGORY_OPTIONS: readonly SelectOption[] = [
  { value: 'nano-plex', label: 'Nano Plex' },
  { value: 'keratin', label: 'Keratin' },
  { value: 'nanoplastia', label: 'Nanoplastia' },
  { value: 'argan', label: 'Argan' },
  { value: 'hair-spa', label: 'Hair Spa' },
  { value: 'hair-serum', label: 'Hair Serum' },
];

export const SERVICE_OPTIONS: readonly SelectOption[] = [
  { value: 'bulk-supply', label: 'Bulk Supply' },
  { value: 'salon-training', label: 'Salon Training' },
  { value: 'same-day-delivery', label: 'Same Day Delivery' },
  { value: 'product-demo', label: 'Product Demo' },
];

// -----------------------------------------------------------------------------
// Seed distributors
// -----------------------------------------------------------------------------

export const DISTRIBUTORS: readonly Distributor[] = [
  {
    id: 'mumbai-hair-supplies',
    name: 'Mumbai Hair Supplies',
    city: 'Mumbai',
    state: 'maharashtra',
    tier: 'gold',
    rating: 4.8,
    reviewCount: 128,
    phone: '+91 98765 43210',
    email: 'mumbai@7elementspro.com',
    products: ['nano-plex', 'keratin', 'hair-spa', 'argan'],
    coverage: 'Mumbai, Thane, Navi Mumbai',
    services: ['bulk-supply', 'salon-training', 'same-day-delivery'],
    pincode: '400612',
  },
  {
    id: 'beauty-planet',
    name: 'Beauty Planet Distributors',
    city: 'Delhi',
    state: 'delhi',
    tier: 'gold',
    rating: 4.7,
    reviewCount: 96,
    phone: '+91 98765 23456',
    email: 'delhi@beautyplanet.in',
    products: ['keratin', 'nano-plex', 'argan', 'hair-serum'],
    coverage: 'Delhi NCR, Noida, Gurugram',
    services: ['bulk-supply', 'product-demo'],
    pincode: '110001',
  },
  {
    id: 'stylish-beauty-care',
    name: 'Stylish Beauty Care',
    city: 'Bangalore',
    state: 'karnataka',
    tier: 'silver',
    rating: 4.6,
    reviewCount: 78,
    phone: '+91 87650 54321',
    email: 'care@stylishbeauty.com',
    products: ['hair-spa', 'keratin', 'argan', 'nano-plex'],
    coverage: 'Bangalore Urban, Mysore',
    services: ['salon-training', 'product-demo'],
    pincode: '560001',
  },
  {
    id: 'lotus-professional-care',
    name: 'Lotus Professional Care',
    city: 'Ahmedabad',
    state: 'gujarat',
    tier: 'bronze',
    rating: 4.5,
    reviewCount: 63,
    phone: '+91 98789 01234',
    email: 'info@lotusprocare.in',
    products: ['nano-plex', 'keratin', 'hair-serum'],
    coverage: 'Ahmedabad, Gandhinagar',
    services: ['bulk-supply'],
    pincode: '380001',
  },
  {
    id: 'chennai-salon-supply',
    name: 'Chennai Salon Supply',
    city: 'Chennai',
    state: 'tamil-nadu',
    tier: 'gold',
    rating: 4.9,
    reviewCount: 141,
    phone: '+91 98400 11223',
    email: 'hello@chennaisalon.in',
    products: ['nano-plex', 'nanoplastia', 'keratin', 'hair-spa'],
    coverage: 'Chennai, Kanchipuram',
    services: ['bulk-supply', 'salon-training', 'same-day-delivery'],
    pincode: '600001',
  },
  {
    id: 'hyderabad-glow',
    name: 'Glow Professional Hyderabad',
    city: 'Hyderabad',
    state: 'telangana',
    tier: 'silver',
    rating: 4.6,
    reviewCount: 87,
    phone: '+91 90000 55667',
    email: 'orders@glowpro.in',
    products: ['argan', 'hair-spa', 'hair-serum'],
    coverage: 'Hyderabad, Secunderabad',
    services: ['product-demo', 'same-day-delivery'],
    pincode: '500001',
  },
  {
    id: 'kolkata-elegance',
    name: 'Elegance Hair Distributors',
    city: 'Kolkata',
    state: 'west-bengal',
    tier: 'bronze',
    rating: 4.4,
    reviewCount: 52,
    phone: '+91 98300 77889',
    email: 'contact@elegancehair.in',
    products: ['keratin', 'argan'],
    coverage: 'Kolkata, Howrah',
    services: ['bulk-supply'],
    pincode: '700001',
  },
  {
    id: 'pune-shine',
    name: 'Shine Salon Supplies',
    city: 'Pune',
    state: 'maharashtra',
    tier: 'silver',
    rating: 4.7,
    reviewCount: 94,
    phone: '+91 98220 33445',
    email: 'pune@shinesalon.in',
    products: ['nano-plex', 'hair-spa', 'nanoplastia'],
    coverage: 'Pune, Pimpri-Chinchwad',
    services: ['salon-training', 'bulk-supply'],
    pincode: '411001',
  },
  {
    id: 'jaipur-royal',
    name: 'Royal Beauty Traders',
    city: 'Jaipur',
    state: 'rajasthan',
    tier: 'bronze',
    rating: 4.3,
    reviewCount: 41,
    phone: '+91 94140 22110',
    email: 'sales@royalbeauty.in',
    products: ['keratin', 'hair-serum'],
    coverage: 'Jaipur, Ajmer',
    services: ['bulk-supply', 'product-demo'],
    pincode: '302001',
  },
  {
    id: 'surat-luxe',
    name: 'Luxe Hair Care Surat',
    city: 'Surat',
    state: 'gujarat',
    tier: 'silver',
    rating: 4.5,
    reviewCount: 68,
    phone: '+91 98252 66778',
    email: 'surat@luxehair.in',
    products: ['argan', 'nano-plex', 'keratin'],
    coverage: 'Surat, Vadodara',
    services: ['same-day-delivery'],
    pincode: '395001',
  },
  {
    id: 'coimbatore-crown',
    name: 'Crown Professional Care',
    city: 'Coimbatore',
    state: 'tamil-nadu',
    tier: 'bronze',
    rating: 4.4,
    reviewCount: 57,
    phone: '+91 98430 99001',
    email: 'crown@procare.in',
    products: ['hair-spa', 'argan'],
    coverage: 'Coimbatore, Tiruppur',
    services: ['product-demo'],
    pincode: '641001',
  },
  {
    id: 'nagpur-orchid',
    name: 'Orchid Salon Distributors',
    city: 'Nagpur',
    state: 'maharashtra',
    tier: 'gold',
    rating: 4.8,
    reviewCount: 112,
    phone: '+91 91234 55443',
    email: 'nagpur@orchidsalon.in',
    products: ['nano-plex', 'keratin', 'nanoplastia', 'hair-serum'],
    coverage: 'Nagpur, Amravati',
    services: ['bulk-supply', 'salon-training'],
    pincode: '440001',
  },
];

/** Distributors shown per page in the results grid. */
export const DISTRIBUTORS_PER_PAGE = 8;

// -----------------------------------------------------------------------------
// Find a distributor — page copy
// -----------------------------------------------------------------------------

export const FIND_HERO = {
  script: 'Our Strength. Our Network.',
  titleLines: ['Distributor', 'Network'],
  body:
    'Serving professionals across India through our trusted network of authorised ' +
    'distributors.',
  primaryCta: 'Find A Distributor',
  secondaryCta: 'Become A Distributor',
  badgeValue: '18+',
  badgeLabel: 'Years Of Trust',
  // TODO: verify this render matches the reference's product-and-blossom frame.

  imageAlt: '7 Elements Professional range on a podium with blossoms',
} as const;

// -----------------------------------------------------------------------------
// Become a distributor — page copy
// -----------------------------------------------------------------------------

export const BECOME_HERO = {
  script: 'Grow With Us',
  titleLines: ['Become A', 'Distributor'],
  body:
    'Join the 7 Elements Professional family and grow your business with premium ' +
    'quality hair care products trusted by professionals.',
  imageAlt: 'The 7 Elements Professional range',
} as const;

export const BECOME_BENEFITS: readonly DistributorBenefit[] = [
  { id: 'margins', title: 'High Profit Margins', subtitle: 'Attractive earning opportunities', iconPaths: ICON.margin },
  { id: 'territory', title: 'Exclusive Territory', subtitle: 'Be the trusted partner in your area', iconPaths: ICON.territory },
  { id: 'marketing', title: 'Marketing & Branding Support', subtitle: 'Complete support to grow your business', iconPaths: ICON.marketing },
  { id: 'training', title: 'Product Training', subtitle: 'Regular training and product knowledge', iconPaths: ICON.training },
  { id: 'launch', title: 'New Launch First Access', subtitle: 'Be the first to offer our new launches', iconPaths: ICON.launch },
  { id: 'growth', title: 'Long Term Business Growth', subtitle: 'Build a lasting professional partnership', iconPaths: ICON.growth },
];

export const PARTNER_REASONS: readonly DistributorBenefit[] = [
  { id: 'quality', title: 'Premium Quality', subtitle: 'Products', iconPaths: ICON.training },
  { id: 'discounts', title: 'Attractive', subtitle: 'Distributor Discounts', iconPaths: ICON.margin },
  { id: 'delivery', title: 'Timely Product', subtitle: 'Delivery', iconPaths: ICON.launch },
  { id: 'support', title: 'Marketing & Sales', subtitle: 'Support', iconPaths: ICON.marketing },
  { id: 'brand', title: 'Strong Brand', subtitle: 'Recognition', iconPaths: ICON.territory },
  { id: 'growth', title: 'Long Term', subtitle: 'Business Growth', iconPaths: ICON.growth },
];

export const FORM_STEPS: readonly FormStep[] = [
  { id: 'personal', label: 'Personal Details' },
  { id: 'business', label: 'Business Details' },
  { id: 'documents', label: 'Documents' },
  { id: 'review', label: 'Review & Submit' },
];

export const BUSINESS_TYPE_OPTIONS: readonly SelectOption[] = [
  { value: 'salon', label: 'Salon' },
  { value: 'retail', label: 'Retail Store' },
  { value: 'wholesale', label: 'Wholesaler' },
  { value: 'academy', label: 'Academy / Training' },
  { value: 'other', label: 'Other' },
];

export const YEARS_IN_BUSINESS_OPTIONS: readonly SelectOption[] = [
  { value: '0-1', label: 'Less than 1 year' },
  { value: '1-3', label: '1 – 3 years' },
  { value: '3-5', label: '3 – 5 years' },
  { value: '5-10', label: '5 – 10 years' },
  { value: '10+', label: 'More than 10 years' },
];

export const GENDER_OPTIONS: readonly SelectOption[] = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
  { value: 'other', label: 'Other' },
  { value: 'undisclosed', label: 'Prefer not to say' },
];

export const DISTRIBUTOR_SUPPORT = {
  title: 'Need Help?',
  body: 'Our team is here to help you at every step.',
  // TODO: replace with the real distributor support line and mailbox.
  phone: '+91 98765 43210',
  email: 'info@7elementsprofessional.com',
} as const;
