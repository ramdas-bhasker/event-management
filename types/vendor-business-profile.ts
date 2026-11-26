import type {
  EventCategorySlug,
  PriceTypeSlug,
  VendorCategorySlug,
  VendorLocationSlug,
  VendorRecord,
} from '@/types/vendor';

export interface VendorPortfolioPreviewItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  status: 'READY' | 'UPLOADING';
}

export interface VendorBusinessProfile {
  vendorId: string;
  vendorSlug: string;
  ownerName: string;
  accountMobile: string;
  accountEmail: string;
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
  customServiceAreas: string[];
  keySpecialties: string[];
  specialtiesDescription: string;
  languagesSpoken: string[];
  eventCategories: Exclude<EventCategorySlug, 'all'>[];
  guestCapacity: VendorRecord['guestCapacity'];
  businessExperience: string;
  pricingModel: 'Fixed Price' | 'Per Event' | 'Per Plate' | 'Per Guest' | 'Custom Quote';
  startingPrice: string;
  displayPricePublicly: boolean;
  contactForPrice: boolean;
  pricingNotes: string;
  portfolioItems: VendorPortfolioPreviewItem[];
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
  yearEstablished?: string;
  businessEmail?: string;
  businessPhone?: string;
  alternativePhone?: string;
  websiteUrl?: string;
  businessAddress?: string;
  pinCode?: string;
  showPhone?: boolean;
  showEmail?: boolean;
  acceptEnquiries?: boolean;
  location: string;
  serviceAreas: VendorBusinessProfile['serviceAreas'];
  services: string[];
  eventCategories: VendorBusinessProfile['eventCategories'];
  guestCapacity: VendorBusinessProfile['guestCapacity'];
  startingPrice?: number | null;
  priceDisplay?: string;
  priceType?: PriceTypeSlug;
  priceTypeLabel?: string;
}
