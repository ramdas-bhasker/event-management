import { LOCATION_AREA_OPTIONS, VENDOR_CATEGORY_OPTIONS } from '@/data/mock-vendors';
import type { VendorBusinessProfile, VendorPublicProfilePreview } from '@/types/vendor-business-profile';
import type { VendorRecord } from '@/types/vendor';

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

export function createBusinessProfile(vendor: VendorRecord): VendorBusinessProfile {
  const locationParts = vendor.location.split(',').map((part) => part.trim());
  return {
    vendorId: vendor.id,
    vendorSlug: vendor.slug,
    businessName: vendor.businessName,
    category: vendor.category,
    description: vendor.description,
    yearEstablished: '',
    businessEmail: '',
    businessPhone: '',
    alternativePhone: '',
    websiteUrl: '',
    state: locationParts.length > 2 ? locationParts.slice(2).join(', ') : '',
    city: locationParts.length > 1 ? locationParts[1] : '',
    areaLocality: locationParts[0] || '',
    businessAddress: '',
    pinCode: '',
    serviceAreas: vendor.serviceAreas.slice(),
    keySpecialties: vendor.services.slice(),
    languagesSpoken: [],
    eventCategories: vendor.eventCategories.slice(),
    guestCapacity: vendor.guestCapacity.slice(),
    businessExperience: '',
    showPhone: false,
    showEmail: false,
    acceptEnquiries: true,
  };
}

export function calculateProfileCompletion(profile: VendorBusinessProfile) {
  const isComplete = (key: keyof VendorBusinessProfile) => String(profile[key] ?? '').trim().length > 0;
  const completed = PROFILE_COMPLETION_FIELDS.filter(({ key }) => isComplete(key)).length;
  return {
    percentage: Math.round((completed / PROFILE_COMPLETION_FIELDS.length) * 100),
    completed,
    total: PROFILE_COMPLETION_FIELDS.length,
    missing: PROFILE_COMPLETION_FIELDS.filter(({ key }) => !isComplete(key)),
  };
}

export function readVendorBusinessProfileSession(vendor: VendorRecord): VendorBusinessProfile {
  const base = createBusinessProfile(vendor);
  if (typeof window === 'undefined') return base;
  try {
    const savedRaw = sessionStorage.getItem(`${BUSINESS_PROFILE_STORAGE_PREFIX}${vendor.slug}`);
    const draftRaw = sessionStorage.getItem(`${BUSINESS_PROFILE_DRAFT_PREFIX}${vendor.slug}`);
    const saved = savedRaw ? JSON.parse(savedRaw) as VendorBusinessProfile : base;
    const draft = draftRaw ? JSON.parse(draftRaw) as VendorBusinessProfile : saved;
    const safeSaved = saved.vendorId === vendor.id && saved.vendorSlug === vendor.slug ? { ...base, ...saved } : base;
    return draft.vendorId === vendor.id && draft.vendorSlug === vendor.slug ? { ...safeSaved, ...draft } : safeSaved;
  } catch {
    return base;
  }
}

export function toPublicProfilePreview(profile: VendorBusinessProfile): VendorPublicProfilePreview {
  const categoryLabel = VENDOR_CATEGORY_OPTIONS.find((option) => option.value === profile.category)?.shortLabel ?? '';
  const location = [profile.areaLocality, profile.city, profile.state].filter(Boolean).join(', ');
  return {
    vendorId: profile.vendorId,
    vendorSlug: profile.vendorSlug,
    businessName: profile.businessName,
    category: profile.category,
    categoryLabel,
    description: profile.description,
    location,
    serviceAreas: profile.serviceAreas.slice(),
    services: profile.keySpecialties.slice(),
    eventCategories: profile.eventCategories.slice(),
    guestCapacity: profile.guestCapacity.slice(),
  };
}

export function getServiceAreaLabel(value: string) {
  return LOCATION_AREA_OPTIONS.find((option) => option.value === value)?.shortLabel ?? value;
}
