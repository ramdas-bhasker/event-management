import { LOCATION_AREA_OPTIONS, MOCK_VENDORS, VENDOR_CATEGORY_OPTIONS } from '@/data/mock-vendors';
import type {
  VendorBusinessProfile,
  VendorPortfolioPreviewItem,
  VendorPublicProfilePreview,
} from '@/types/vendor-business-profile';
import type { PriceTypeSlug, VendorCategorySlug, VendorLocationSlug, VendorRecord } from '@/types/vendor';

export const DEFAULT_MOCK_VENDOR_SLUG = 'sri-venkateswara-mandap-floral';

export function getDefaultMockVendor(): VendorRecord {
  return (
    MOCK_VENDORS.find((record) => record.slug === DEFAULT_MOCK_VENDOR_SLUG) ?? MOCK_VENDORS[0]
  );
}

export const PROFILE_COMPLETION_FIELDS: { key: keyof VendorBusinessProfile; label: string }[] = [
  { key: 'businessName', label: 'Business / Brand Name' },
  { key: 'category', label: 'Vendor Category' },
  { key: 'description', label: 'Business Description' },
  { key: 'yearEstablished', label: 'Year Established' },
  { key: 'businessEmail', label: 'Business Email' },
  { key: 'businessPhone', label: 'Business Phone Number' },
  { key: 'state', label: 'State' },
  { key: 'city', label: 'City' },
  { key: 'areaLocality', label: 'Area / Locality' },
  { key: 'businessAddress', label: 'Full Business Address' },
  { key: 'pinCode', label: 'PIN Code' },
];

export const BUSINESS_PROFILE_STORAGE_PREFIX = 'ayojansetu_vendor_business_profile_';
export const BUSINESS_PROFILE_DRAFT_PREFIX = 'ayojansetu_vendor_business_profile_draft_';
export const BUSINESS_PROFILE_PREVIEW_COOKIE = 'ayojansetu_vendor_profile_preview';

export const DEFAULT_ONBOARDING_PORTFOLIO_ITEMS: VendorPortfolioPreviewItem[] = [
  {
    id: 'p-1',
    title: 'Royal Ivory & Botanical Mandap',
    category: 'Mandap',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBLeCXageEXmKl7joJQoJdknCuIoR_aOzTyu7yqxA_RtEU2jeWAEg1NlB2cN_6pPAmWclAUd4XkVTPIgk8BBfGYoCWrfwE-bnqiK2bLm6ClmwGBas4fQl_wrWsZkluqF2rrY1G1gY7eV0flCr4uNPGr6aXSCzz-mRH2rJz2_dirh7YGHMrjr5_lIDbrFjIJco2CASF_WK9qCoyba9PrHvmRm4k5aqAiQ1QLbWn7H7k',
    status: 'READY',
  },
  {
    id: 'p-2',
    title: 'Eucalyptus & White Orchid Reception',
    category: 'Floral',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC4lIuj0VWa9gvbmlf9HLUXrwca2dRsz_GYKN2VfzJU4a-lmROcOsU4FQ0TvcuEXf7CPvPipN0TSKBNGCHq4NMmsJGvjuntLhOvNfLmiS40vJiwPgluhGsf5AEobibU8Zj81U9vJWHeqpS2uSXFmoHhEUEO6Frwp7Y_SJp_yiqVFKUoi2Egd0rZsrMRHTuGVm_6qjXMD4R8sCNJ_UXS7Bhjd22ZMYUyNXSZDZhXjyc',
    status: 'READY',
  },
  {
    id: 'p-3',
    title: 'Gilded Arch Sangeet Stage',
    category: 'Stage',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAwcD8FlwGHRCziscU_vdhbOsduHqbgNA7dfKW60nv-stw1PNGTTWGHQz9EUoW1mi1vnZUtig9_kP3W5OamhIOrSs-Mt-4l7Ycw9n2qvje-PigWD247FMJ6C_9EnSxNuHe8jqa3IAVN7tIGmoeGS9vbsDbyN1y9tgw9B_n6DpI6BRuPUpMMeBCLVnr8KhN_X_ZoEpAYBmaCM2nST281KjN348YQvKAdqmC2Eh0WRPE',
    status: 'READY',
  },
];

/**
 * Creates the canonical shared baseline profile for the mock vendor account
 * (`Sri Venkateswara Mandap & Floral`), reusing the exact sample values shown across
 * the Vendor Onboarding screens and Vendor Workspace.
 */
export function createBusinessProfile(vendor: VendorRecord = getDefaultMockVendor()): VendorBusinessProfile {
  const isSriVenkateswara = vendor.slug === DEFAULT_MOCK_VENDOR_SLUG;
  const locationParts = vendor.location.split(',').map((part) => part.trim());

  const defaultServiceAreas: Exclude<VendorLocationSlug, 'hyderabad'>[] = isSriVenkateswara
    ? ['banjara-hills', 'jubilee-hills', 'gachibowli', 'madhapur']
    : vendor.serviceAreas.slice();

  const defaultSpecialties = isSriVenkateswara
    ? [
        'Mandap Decoration',
        'Floral Decoration',
        'Stage Decoration',
        'Lighting',
        'Entrance Decoration',
        'Traditional Mandaps',
      ]
    : vendor.services.slice();

  return {
    vendorId: vendor.id,
    vendorSlug: vendor.slug,
    ownerName: isSriVenkateswara ? 'Ramesh Rao' : vendor.businessName,
    accountMobile: isSriVenkateswara ? '98765 43210' : '',
    accountEmail: isSriVenkateswara ? 'ramesh@srivenkateswaramandap.in' : '',
    businessName: vendor.businessName,
    category: vendor.category,
    description: isSriVenkateswara
      ? 'Specializing in bespoke South Indian temple mandaps, fresh jasmine & marigold installations, and contemporary botanical reception stages across Hyderabad.'
      : vendor.description,
    yearEstablished: isSriVenkateswara ? '2016' : '',
    businessEmail: isSriVenkateswara ? 'bookings@srivenkateswaramandap.in' : '',
    businessPhone: isSriVenkateswara ? '98490 54321' : '',
    alternativePhone: isSriVenkateswara ? '91234 56789' : '',
    websiteUrl: '',
    state: isSriVenkateswara
      ? 'Telangana'
      : locationParts.length > 2
        ? locationParts.slice(2).join(', ')
        : 'Telangana',
    city: isSriVenkateswara
      ? 'Hyderabad'
      : locationParts.length > 1
        ? locationParts[1]
        : 'Hyderabad',
    areaLocality: isSriVenkateswara ? 'Banjara Hills' : locationParts[0] || '',
    businessAddress: isSriVenkateswara
      ? 'Plot 42, Road No. 12, Near KBR National Park, Banjara Hills, Hyderabad, Telangana'
      : '',
    pinCode: isSriVenkateswara ? '500034' : '',
    serviceAreas: defaultServiceAreas,
    customServiceAreas: [],
    keySpecialties: defaultSpecialties,
    specialtiesDescription: '',
    languagesSpoken: isSriVenkateswara ? ['Telugu', 'Hindi', 'English'] : [],
    eventCategories: vendor.eventCategories.slice(),
    guestCapacity: vendor.guestCapacity.slice(),
    businessExperience: isSriVenkateswara ? '10 years' : '',
    pricingModel: 'Per Event',
    startingPrice: vendor.startingPrice ? vendor.startingPrice.toLocaleString('en-IN') : '65,000',
    displayPricePublicly: true,
    contactForPrice: false,
    pricingNotes: '',
    portfolioItems: DEFAULT_ONBOARDING_PORTFOLIO_ITEMS.map((item) => ({ ...item })),
    showPhone: true,
    showEmail: true,
    acceptEnquiries: true,
  };
}

export function calculateProfileCompletion(profile: VendorBusinessProfile) {
  const isComplete = (key: keyof VendorBusinessProfile) =>
    String(profile[key] ?? '').trim().length > 0;
  const completed = PROFILE_COMPLETION_FIELDS.filter(({ key }) => isComplete(key)).length;
  return {
    percentage: Math.round((completed / PROFILE_COMPLETION_FIELDS.length) * 100),
    completed,
    total: PROFILE_COMPLETION_FIELDS.length,
    missing: PROFILE_COMPLETION_FIELDS.filter(({ key }) => !isComplete(key)),
  };
}

function readStorageItem(key: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const sessionVal = sessionStorage.getItem(key);
    if (sessionVal) return sessionVal;
  } catch {
    // Fall back to localStorage
  }
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorageItem(key: string, value: string) {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(key, value);
  } catch {
    // Ignore quota errors
  }
  try {
    localStorage.setItem(key, value);
  } catch {
    // Ignore quota errors
  }
}

function removeStorageItem(key: string) {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(key);
  } catch {
    // Ignore
  }
  try {
    localStorage.removeItem(key);
  } catch {
    // Ignore
  }
}

function mergeWithBaseProfile(
  base: VendorBusinessProfile,
  candidate?: Partial<VendorBusinessProfile> | null
): VendorBusinessProfile {
  if (!candidate || candidate.vendorSlug !== base.vendorSlug) return base;
  return {
    ...base,
    ...candidate,
    serviceAreas: Array.isArray(candidate.serviceAreas)
      ? candidate.serviceAreas
      : base.serviceAreas,
    customServiceAreas: Array.isArray(candidate.customServiceAreas)
      ? candidate.customServiceAreas
      : base.customServiceAreas,
    keySpecialties: Array.isArray(candidate.keySpecialties)
      ? candidate.keySpecialties
      : base.keySpecialties,
    languagesSpoken: Array.isArray(candidate.languagesSpoken)
      ? candidate.languagesSpoken
      : base.languagesSpoken,
    eventCategories: Array.isArray(candidate.eventCategories)
      ? candidate.eventCategories
      : base.eventCategories,
    guestCapacity: Array.isArray(candidate.guestCapacity)
      ? candidate.guestCapacity
      : base.guestCapacity,
    portfolioItems: Array.isArray(candidate.portfolioItems)
      ? candidate.portfolioItems
      : base.portfolioItems,
  };
}

export function readSavedVendorBusinessProfile(
  vendor: VendorRecord = getDefaultMockVendor()
): VendorBusinessProfile {
  const base = createBusinessProfile(vendor);
  if (typeof window === 'undefined') return base;
  try {
    const savedRaw = readStorageItem(`${BUSINESS_PROFILE_STORAGE_PREFIX}${vendor.slug}`);
    const saved = savedRaw ? (JSON.parse(savedRaw) as Partial<VendorBusinessProfile>) : null;
    return mergeWithBaseProfile(base, saved);
  } catch {
    return base;
  }
}

export function readVendorBusinessProfileSession(
  vendor: VendorRecord = getDefaultMockVendor()
): VendorBusinessProfile {
  const base = createBusinessProfile(vendor);
  if (typeof window === 'undefined') return base;
  try {
    const savedRaw = readStorageItem(`${BUSINESS_PROFILE_STORAGE_PREFIX}${vendor.slug}`);
    const draftRaw = readStorageItem(`${BUSINESS_PROFILE_DRAFT_PREFIX}${vendor.slug}`);
    const saved = savedRaw ? (JSON.parse(savedRaw) as Partial<VendorBusinessProfile>) : null;
    const safeSaved = mergeWithBaseProfile(base, saved);
    const draft = draftRaw ? (JSON.parse(draftRaw) as Partial<VendorBusinessProfile>) : null;
    return mergeWithBaseProfile(safeSaved, draft);
  } catch {
    return base;
  }
}

export function syncPublicProfilePreviewCookie(profile: VendorBusinessProfile) {
  if (typeof document === 'undefined') return;
  try {
    const preview = toPublicProfilePreview(profile);
    const encoded = encodeURIComponent(JSON.stringify(preview));
    if (encoded.length <= 3800) {
      document.cookie = `${BUSINESS_PROFILE_PREVIEW_COOKIE}=${encoded}; Path=/; SameSite=Lax`;
    }
  } catch {
    // Ignore cookie sync errors
  }
}

export function saveVendorBusinessProfileSession(
  profile: VendorBusinessProfile,
  options: { commitSaved?: boolean; keepDraft?: boolean } = { commitSaved: true, keepDraft: false }
) {
  const serialized = JSON.stringify(profile);
  const savedKey = `${BUSINESS_PROFILE_STORAGE_PREFIX}${profile.vendorSlug}`;
  const draftKey = `${BUSINESS_PROFILE_DRAFT_PREFIX}${profile.vendorSlug}`;

  if (options.commitSaved !== false) {
    writeStorageItem(savedKey, serialized);
  }
  if (options.keepDraft) {
    writeStorageItem(draftKey, serialized);
  } else if (options.commitSaved !== false) {
    removeStorageItem(draftKey);
  } else {
    writeStorageItem(draftKey, serialized);
  }

  syncPublicProfilePreviewCookie(profile);
}

export function discardVendorBusinessProfileDraft(vendorSlug: string) {
  removeStorageItem(`${BUSINESS_PROFILE_DRAFT_PREFIX}${vendorSlug}`);
}

export function toPublicProfilePreview(profile: VendorBusinessProfile): VendorPublicProfilePreview {
  const categoryLabel =
    VENDOR_CATEGORY_OPTIONS.find((option) => option.value === profile.category)?.shortLabel ??
    'Wedding Decorators';
  const location = [profile.areaLocality, profile.city, profile.state].filter(Boolean).join(', ');

  const numericPrice = Number(String(profile.startingPrice || '').replace(/[^0-9]/g, ''));
  const isCustomQuote =
    profile.contactForPrice ||
    !profile.displayPricePublicly ||
    profile.pricingModel === 'Custom Quote' ||
    !numericPrice;

  const modelToSlug: Record<VendorBusinessProfile['pricingModel'], PriceTypeSlug> = {
    'Fixed Price': 'per-event',
    'Per Event': 'per-event',
    'Per Plate': 'per-plate',
    'Per Guest': 'per-plate',
    'Custom Quote': 'custom-quote',
  };

  return {
    vendorId: profile.vendorId,
    vendorSlug: profile.vendorSlug,
    businessName: profile.businessName,
    category: profile.category,
    categoryLabel,
    description: profile.description,
    yearEstablished: profile.yearEstablished,
    businessEmail: profile.businessEmail,
    businessPhone: profile.businessPhone,
    alternativePhone: profile.alternativePhone,
    websiteUrl: profile.websiteUrl,
    businessAddress: profile.businessAddress,
    pinCode: profile.pinCode,
    showPhone: profile.showPhone,
    showEmail: profile.showEmail,
    acceptEnquiries: profile.acceptEnquiries,
    location,
    serviceAreas: profile.serviceAreas.slice(),
    services: profile.keySpecialties.slice(),
    eventCategories: profile.eventCategories.slice(),
    guestCapacity: profile.guestCapacity.slice(),
    startingPrice: isCustomQuote ? null : numericPrice,
    priceDisplay: isCustomQuote
      ? 'Custom Quote'
      : `₹${numericPrice.toLocaleString('en-IN')}`,
    priceType: isCustomQuote ? 'custom-quote' : modelToSlug[profile.pricingModel],
    priceTypeLabel: isCustomQuote ? 'Custom Quote' : profile.pricingModel,
  };
}

export function getServiceAreaLabel(value: string) {
  return LOCATION_AREA_OPTIONS.find((option) => option.value === value)?.shortLabel ?? value;
}

export function getCategoryLabelFromSlug(slug: Exclude<VendorCategorySlug, 'all'>): string {
  return (
    VENDOR_CATEGORY_OPTIONS.find((option) => option.value === slug)?.shortLabel ??
    'Wedding Decorators'
  );
}

export function getCategorySlugFromLabel(label: string): Exclude<VendorCategorySlug, 'all'> {
  const found = VENDOR_CATEGORY_OPTIONS.find(
    (option) =>
      option.value !== 'all' &&
      (option.shortLabel.toLowerCase() === label.toLowerCase() ||
        option.label.toLowerCase() === label.toLowerCase() ||
        option.value.toLowerCase() === label.toLowerCase())
  );
  if (found && found.value !== 'all') {
    return found.value;
  }
  return 'wedding-decorators';
}
