/**
 * AyojanSetu – Domain & UI Type Definitions (All-Events Marketplace)
 */

export type ServiceId =
  | 'all'
  | 'decorators'
  | 'photography'
  | 'catering'
  | 'venue'
  | 'makeup'
  | 'planners'
  | 'dj'
  | 'florists';

export type MicroMarketId =
  | 'all'
  | 'banjara'
  | 'jubilee'
  | 'gachibowli'
  | 'madhapur'
  | 'secunderabad'
  | 'kondapur';

export type EventTypeFilter =
  | 'All Events'
  | 'Weddings'
  | 'Birthdays'
  | 'Corporate Events'
  | 'Family Functions'
  | 'Traditional Functions'
  | 'Private Celebrations';

export interface MegaMenuVendorItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  serviceId: ServiceId;
}

export interface MegaMenuCategoryItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  eventFilter: EventTypeFilter;
}

export interface DropdownOption<T extends string = string> {
  value: T;
  label: string;
  icon: string;
}

export interface TrendingSearchTag {
  label: string;
  serviceId: ServiceId;
  href: string;
}

export interface OccasionCategory {
  id: string;
  title: string;
  description: string;
  pillLabel: string;
  ctaLabel: string;
  imageUrl: string;
  imageAlt: string;
  href: string;
  eventFilter: EventTypeFilter;
}

export interface PopularServiceItem {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  href: string;
  serviceId: ServiceId;
}

export interface FeaturedVendor {
  id: string;
  name: string;
  categoryLabel: string;
  categoryIcon: string;
  serviceId: ServiceId;
  locationId: MicroMarketId;
  location: string;
  priceCaption: string;
  priceValue: string;
  imageUrl: string;
  imageAlt: string;
  badgeLabel: string;
  verificationStatus: string;
  about: string;
  rating?: string;
  reviewCount?: number;
}

export interface HowItWorksStep {
  number: string;
  icon: string;
  title: string;
  description: string;
  trustBadge: string;
}

export interface WhyPledgeItem {
  icon: string;
  title: string;
  description: string;
}

export interface WhyFeatureItem {
  icon: string;
  title: string;
  description: string;
  spanTwo?: boolean;
}

export interface EnquiryFormPayload {
  vendorName: string;
  fullName: string;
  mobileNumber: string;
  eventOccasion: string;
  eventDate: string;
  notes: string;
  submittedAt: string;
}
