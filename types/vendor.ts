/**
 * AyojanSetu – Vendor Search & Directory Type Definitions
 */

export type VendorCategorySlug =
  | 'all'
  | 'wedding-decorators'
  | 'wedding-photographers'
  | 'caterers'
  | 'makeup-artists'
  | 'event-venues'
  | 'event-planners'
  | 'djs-and-entertainment';

export type EventCategorySlug =
  | 'all'
  | 'weddings-receptions'
  | 'corporate-galas'
  | 'pooja-traditional'
  | 'birthdays-milestones'
  | 'private-celebrations';

export type VendorLocationSlug =
  | 'hyderabad'
  | 'banjara-hills'
  | 'jubilee-hills'
  | 'gachibowli'
  | 'madhapur'
  | 'secunderabad'
  | 'gandipet-shamshabad'
  | 'kukatpally-kondapur';

export type BudgetRangeSlug =
  | 'all'
  | 'under-50k'
  | '50k-150k'
  | '150k-300k'
  | '300k-plus';

export type PriceTypeSlug =
  | 'per-event'
  | 'per-plate'
  | 'per-day'
  | 'custom-quote';

export type GuestCapacitySlug = 'all' | 'intimate' | 'medium' | 'grand';

export type VendorSortOption =
  | 'recommended'
  | 'price-asc'
  | 'price-desc'
  | 'recent';

export interface VendorRecord {
  id: string;
  slug: string;
  businessName: string;
  category: Exclude<VendorCategorySlug, 'all'>;
  categoryLabel: string;
  eventCategories: Exclude<EventCategorySlug, 'all'>[];
  location: string;
  locationSlug: Exclude<VendorLocationSlug, 'hyderabad'>;
  serviceAreas: Exclude<VendorLocationSlug, 'hyderabad'>[];
  description: string;
  portfolioImages: string[];
  /**
   * Numeric starting price in INR for sorting & budget filtering.
   * Null when the vendor offers Custom Quote only.
   */
  startingPrice: number | null;
  priceDisplay: string;
  priceCaption: string;
  priceType: PriceTypeSlug;
  priceTypeLabel: string;
  services: string[];
  specialtyBadge: string;
  specialtyIcon: string;
  /**
   * Optional rating & reviewCount: only populated when sample review data exists.
   */
  rating?: number;
  reviewCount?: number;
  /**
   * Only true when vendor has completed verification checks in the sample dataset.
   */
  verified: boolean;
  respondsFast: boolean;
  guestCapacity: Exclude<GuestCapacitySlug, 'all'>[];
  createdAt: string;
}

export interface VendorFilterState {
  category: VendorCategorySlug;
  event: EventCategorySlug;
  location: VendorLocationSlug;
  areas: Exclude<VendorLocationSlug, 'hyderabad'>[];
  budget: BudgetRangeSlug;
  priceTypes: PriceTypeSlug[];
  services: string[];
  verifiedOnly: boolean;
  fastResponseOnly: boolean;
  capacity: GuestCapacitySlug;
  query: string;
  sort: VendorSortOption;
  page: number;
  perPage: number;
}

export interface ActiveFilterChipItem {
  key: string;
  label: string;
  onRemove: () => void;
}
