import type { VendorCategorySlug } from '@/types/vendor';

export interface EnquiryVendor {
  id: string;
  businessName: string;
  category: Exclude<VendorCategorySlug, 'all'>;
  categoryLabel: string;
  location: string;
  priceDisplay: string;
  portfolioImages: string[];
  services: string[];
  servicesNote?: string;
  profileHref: string;
}
