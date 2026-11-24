import type { EventCategorySlug, VendorCategorySlug, VendorLocationSlug, VendorRecord } from '@/types/vendor';

export interface VendorBusinessProfile {
  vendorId: string;
  vendorSlug: string;
  businessName: string;
  category: Exclude<VendorCategorySlug, 'all'>;
  description: string;
  yearEstablished: string;
  businessEmail: string;
  businessPhone: string;
  alternativePhone: string;
  websiteUrl: string;
  state: string;
  city: string;
  areaLocality: string;
  businessAddress: string;
  pinCode: string;
  serviceAreas: Exclude<VendorLocationSlug, 'hyderabad'>[];
  keySpecialties: string[];
  languagesSpoken: string[];
  eventCategories: Exclude<EventCategorySlug, 'all'>[];
  guestCapacity: VendorRecord['guestCapacity'];
  businessExperience: string;
  showPhone: boolean;
  showEmail: boolean;
  acceptEnquiries: boolean;
}

export interface VendorPublicProfilePreview {
  vendorId: string;
  vendorSlug: string;
  businessName: string;
  category: VendorBusinessProfile['category'];
  categoryLabel: string;
  description: string;
  location: string;
  serviceAreas: VendorBusinessProfile['serviceAreas'];
  services: string[];
  eventCategories: VendorBusinessProfile['eventCategories'];
  guestCapacity: VendorBusinessProfile['guestCapacity'];
}
