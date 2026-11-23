/**
 * AyojanSetu – Utility Helpers & Search Route Builders
 */

import type { EventTypeFilter, MicroMarketId, ServiceId } from '@/types';
import type {
  BudgetRangeSlug,
  EventCategorySlug,
  VendorCategorySlug,
  VendorLocationSlug,
} from '@/types/vendor';

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

export const SHORT_MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

export const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] as const;

export const MUHURTHAM_DAYS_BY_MONTH: Record<number, number[]> = {
  10: [19, 20, 22, 25, 28, 29],
  11: [3, 4, 6, 11, 13, 18, 20, 25],
  0: [15, 18, 22, 24, 29],
  1: [5, 7, 12, 14, 19, 21],
};

export function formatIsoDate(year: number, monthIndex: number, day: number): string {
  const mm = String(monthIndex + 1).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  return `${year}-${mm}-${dd}`;
}

export function formatPanchangamDisplayDate(
  year: number,
  monthIndex: number,
  day: number,
  isMuhurtham: boolean
): string {
  const ddFormatted = String(day).padStart(2, '0');
  const suffix = isMuhurtham ? ' · Muhurtham' : '';
  return `${ddFormatted} ${SHORT_MONTHS[monthIndex]} ${year}${suffix}`;
}

const SERVICE_TO_CATEGORY_MAP: Record<Exclude<ServiceId, 'all'>, Exclude<VendorCategorySlug, 'all'>> = {
  decorators: 'wedding-decorators',
  florists: 'wedding-decorators',
  photography: 'wedding-photographers',
  catering: 'caterers',
  venue: 'event-venues',
  makeup: 'makeup-artists',
  planners: 'event-planners',
  dj: 'djs-and-entertainment',
};

const MICRO_MARKET_TO_LOCATION_MAP: Record<MicroMarketId, VendorLocationSlug> = {
  all: 'hyderabad',
  banjara: 'banjara-hills',
  jubilee: 'jubilee-hills',
  gachibowli: 'gachibowli',
  madhapur: 'madhapur',
  secunderabad: 'secunderabad',
  kondapur: 'kukatpally-kondapur',
};

const EVENT_TYPE_TO_SLUG_MAP: Record<Exclude<EventTypeFilter, 'All Events'>, Exclude<EventCategorySlug, 'all'>> = {
  Weddings: 'weddings-receptions',
  Birthdays: 'birthdays-milestones',
  'Corporate Events': 'corporate-galas',
  'Traditional Functions': 'pooja-traditional',
  'Family Functions': 'pooja-traditional',
  'Private Celebrations': 'private-celebrations',
};

export function mapServiceIdToCategorySlug(serviceId?: ServiceId): VendorCategorySlug {
  if (!serviceId || serviceId === 'all') return 'all';
  return SERVICE_TO_CATEGORY_MAP[serviceId] || 'all';
}

export function mapMicroMarketToLocationSlug(locationId?: MicroMarketId): VendorLocationSlug {
  if (!locationId) return 'hyderabad';
  return MICRO_MARKET_TO_LOCATION_MAP[locationId] || 'hyderabad';
}

export function mapEventTypeToEventSlug(eventType?: EventTypeFilter): EventCategorySlug {
  if (!eventType || eventType === 'All Events') return 'all';
  return EVENT_TYPE_TO_SLUG_MAP[eventType] || 'all';
}

/**
 * Builds a canonical `/vendors?...` URL with sensible defaults (`location=hyderabad`).
 */
export function buildVendorsSearchUrl(options: {
  category?: VendorCategorySlug;
  serviceId?: ServiceId;
  event?: EventCategorySlug;
  eventType?: EventTypeFilter;
  location?: VendorLocationSlug;
  locationId?: MicroMarketId;
  budget?: BudgetRangeSlug;
  date?: string;
  query?: string;
}): string {
  const params = new URLSearchParams();

  const resolvedCategory =
    options.category ??
    (options.serviceId ? mapServiceIdToCategorySlug(options.serviceId) : 'all');

  const resolvedEvent =
    options.event ??
    (options.eventType ? mapEventTypeToEventSlug(options.eventType) : 'all');

  const resolvedLocation =
    options.location ??
    (options.locationId
      ? mapMicroMarketToLocationSlug(options.locationId)
      : 'hyderabad');

  if (resolvedCategory && resolvedCategory !== 'all') {
    params.set('category', resolvedCategory);
  }

  if (resolvedEvent && resolvedEvent !== 'all') {
    params.set('event', resolvedEvent);
  }

  params.set('location', resolvedLocation || 'hyderabad');

  if (options.budget && options.budget !== 'all') {
    params.set('budget', options.budget);
  }

  if (options.date && options.date !== 'flexible') {
    params.set('date', options.date);
  }

  if (options.query?.trim()) {
    params.set('q', options.query.trim());
  }

  const qs = params.toString();
  return qs ? `/vendors?${qs}` : '/vendors?location=hyderabad';
}
