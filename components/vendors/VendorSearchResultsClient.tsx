'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  EmptySearchState,
  VendorListingSkeletonGrid,
  VendorSearchErrorState,
} from '@/components/vendors/EmptySearchState';
import { VendorFilterDrawer } from '@/components/vendors/VendorFilterDrawer';
import { VendorFilterSidebar } from '@/components/vendors/VendorFilterSidebar';
import { VendorListingGrid } from '@/components/vendors/VendorListingGrid';
import { VendorPagination } from '@/components/vendors/VendorPagination';
import { VendorResultsHeader } from '@/components/vendors/VendorResultsHeader';
import { VendorSearchBar } from '@/components/vendors/VendorSearchBar';
import {
  BUDGET_RANGE_OPTIONS,
  EVENT_CATEGORY_OPTIONS,
  GUEST_CAPACITY_OPTIONS,
  LOCATION_AREA_OPTIONS,
  MOCK_VENDORS,
  PRICE_TYPE_OPTIONS,
  VENDOR_CATEGORY_OPTIONS,
  VENDOR_SORT_OPTIONS,
} from '@/data/mock-vendors';
import { useUiStore } from '@/stores/ui-store';
import type {
  ActiveFilterChipItem,
  BudgetRangeSlug,
  EventCategorySlug,
  GuestCapacitySlug,
  PriceTypeSlug,
  VendorCategorySlug,
  VendorFilterState,
  VendorLocationSlug,
  VendorSortOption,
} from '@/types/vendor';

const VALID_CATEGORIES = new Set<VendorCategorySlug>(
  VENDOR_CATEGORY_OPTIONS.map((c) => c.value)
);
const VALID_EVENTS = new Set<EventCategorySlug>(
  EVENT_CATEGORY_OPTIONS.map((e) => e.value)
);
const VALID_LOCATIONS = new Set<VendorLocationSlug>(
  LOCATION_AREA_OPTIONS.map((l) => l.value)
);
const VALID_BUDGETS = new Set<BudgetRangeSlug>(
  BUDGET_RANGE_OPTIONS.map((b) => b.value)
);
const VALID_PRICE_TYPES = new Set<PriceTypeSlug>(
  PRICE_TYPE_OPTIONS.map((p) => p.value)
);
const VALID_CAPACITIES = new Set<GuestCapacitySlug>(
  GUEST_CAPACITY_OPTIONS.map((g) => g.value)
);
const VALID_SORTS = new Set<VendorSortOption>(
  VENDOR_SORT_OPTIONS.map((s) => s.value)
);

const CATEGORY_ALIASES: Record<string, VendorCategorySlug> = {
  decorators: 'wedding-decorators',
  florists: 'wedding-decorators',
  photography: 'wedding-photographers',
  catering: 'caterers',
  makeup: 'makeup-artists',
  venue: 'event-venues',
  planners: 'event-planners',
  dj: 'djs-and-entertainment',
};

const LOCATION_ALIASES: Record<string, VendorLocationSlug> = {
  all: 'hyderabad',
  banjara: 'banjara-hills',
  jubilee: 'jubilee-hills',
  gachibowli: 'gachibowli',
  madhapur: 'madhapur',
  secunderabad: 'secunderabad',
  kondapur: 'kukatpally-kondapur',
};

function parseCategoryParam(raw: string | null): VendorCategorySlug {
  if (!raw) return 'all';
  const normalized = raw.toLowerCase().trim();
  if (VALID_CATEGORIES.has(normalized as VendorCategorySlug)) {
    return normalized as VendorCategorySlug;
  }
  return CATEGORY_ALIASES[normalized] || 'all';
}

function parseLocationParam(raw: string | null): VendorLocationSlug {
  if (!raw) return 'hyderabad';
  const normalized = raw.toLowerCase().trim();
  if (VALID_LOCATIONS.has(normalized as VendorLocationSlug)) {
    return normalized as VendorLocationSlug;
  }
  return LOCATION_ALIASES[normalized] || 'hyderabad';
}

export function VendorSearchResultsClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const hydrateBookmarks = useUiStore((s) => s.hydrateBookmarks);
  const openEnquiryModal = useUiStore((s) => s.openEnquiryModal);

  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    hydrateBookmarks();
  }, [hydrateBookmarks]);

  // Parse current filter state from URL search parameters
  const filters: VendorFilterState = useMemo(() => {
    const getParam = (key: string): string | null =>
      searchParams ? searchParams.get(key) : null;

    const category = parseCategoryParam(getParam('category'));
    const rawEvent = getParam('event');
    const event: EventCategorySlug =
      rawEvent && VALID_EVENTS.has(rawEvent as EventCategorySlug)
        ? (rawEvent as EventCategorySlug)
        : 'all';

    const location = parseLocationParam(getParam('location'));

    const rawAreas = getParam('areas');
    const parsedAreas = rawAreas
      ? rawAreas
          .split(',')
          .map((a) => a.trim() as Exclude<VendorLocationSlug, 'hyderabad'>)
          .filter(
            (a) =>
              a !== ('hyderabad' as Exclude<VendorLocationSlug, 'hyderabad'>) &&
              VALID_LOCATIONS.has(a)
          )
      : [];

    const rawBudget = getParam('budget');
    const budget: BudgetRangeSlug =
      rawBudget && VALID_BUDGETS.has(rawBudget as BudgetRangeSlug)
        ? (rawBudget as BudgetRangeSlug)
        : 'all';

    const rawPriceTypes = getParam('priceType');
    const priceTypes: PriceTypeSlug[] = rawPriceTypes
      ? rawPriceTypes
          .split(',')
          .map((p) => p.trim() as PriceTypeSlug)
          .filter((p) => VALID_PRICE_TYPES.has(p))
      : [];

    const rawServices = getParam('service');
    const services: string[] = rawServices
      ? rawServices
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    const verifiedOnly = getParam('verified') === 'true';
    const fastResponseOnly = getParam('fast') === 'true';

    const rawCapacity = getParam('capacity');
    const capacity: GuestCapacitySlug =
      rawCapacity && VALID_CAPACITIES.has(rawCapacity as GuestCapacitySlug)
        ? (rawCapacity as GuestCapacitySlug)
        : 'all';

    const rawSort = getParam('sort');
    const sort: VendorSortOption =
      rawSort && VALID_SORTS.has(rawSort as VendorSortOption)
        ? (rawSort as VendorSortOption)
        : 'recommended';

    const rawPage = Number(getParam('page') || '1');
    const page = Number.isFinite(rawPage) && rawPage >= 1 ? Math.floor(rawPage) : 1;

    const rawPerPage = Number(getParam('perPage') || '12');
    const perPage = rawPerPage === 24 ? 24 : 12;

    return {
      category,
      event,
      location,
      areas: parsedAreas,
      budget,
      priceTypes,
      services,
      verifiedOnly,
      fastResponseOnly,
      capacity,
      query: getParam('q') || '',
      sort,
      page,
      perPage,
    };
  }, [searchParams]);

  // Helper to update URL query parameters cleanly
  const updateUrlFilters = useCallback(
    (patch: Partial<VendorFilterState>, resetPage = true) => {
      const next: VendorFilterState = {
        ...filters,
        ...patch,
        page: resetPage ? 1 : patch.page ?? filters.page,
      };

      const params = new URLSearchParams();
      if (next.category !== 'all') params.set('category', next.category);
      if (next.event !== 'all') params.set('event', next.event);
      if (next.location !== 'hyderabad') {
        params.set('location', next.location);
      } else {
        params.set('location', 'hyderabad');
      }
      if (next.areas.length > 0) params.set('areas', next.areas.join(','));
      if (next.budget !== 'all') params.set('budget', next.budget);
      if (next.priceTypes.length > 0)
        params.set('priceType', next.priceTypes.join(','));
      if (next.services.length > 0)
        params.set('service', next.services.join(','));
      if (next.verifiedOnly) params.set('verified', 'true');
      if (next.fastResponseOnly) params.set('fast', 'true');
      if (next.capacity !== 'all') params.set('capacity', next.capacity);
      if (next.sort !== 'recommended') params.set('sort', next.sort);
      if (next.page > 1) params.set('page', String(next.page));
      if (next.perPage !== 12) params.set('perPage', String(next.perPage));

      const basePath = pathname || '/vendors';
      const queryString = params.toString();
      router.push(queryString ? `${basePath}?${queryString}` : basePath, {
        scroll: false,
      });
    },
    [filters, pathname, router]
  );

  // Filter & Sort Vendors
  const filteredAndSortedVendors = useMemo(() => {
    const budgetMeta = BUDGET_RANGE_OPTIONS.find(
      (b) => b.value === filters.budget
    );

    const matching = MOCK_VENDORS.filter((vendor) => {
      // 1. Vendor Category
      if (filters.category !== 'all' && vendor.category !== filters.category) {
        return false;
      }

      // 2. Event Category
      if (
        filters.event !== 'all' &&
        !vendor.eventCategories.includes(filters.event)
      ) {
        return false;
      }

      // 3. Location / Micro-Markets
      const activeAreaSlugs = new Set<Exclude<VendorLocationSlug, 'hyderabad'>>(
        filters.areas
      );
      if (filters.location !== 'hyderabad') {
        activeAreaSlugs.add(filters.location);
      }
      if (activeAreaSlugs.size > 0) {
        const matchesArea = Array.from(activeAreaSlugs).some(
          (areaSlug) =>
            vendor.locationSlug === areaSlug ||
            vendor.serviceAreas.includes(areaSlug)
        );
        if (!matchesArea) return false;
      }

      // 4. Budget Range
      if (filters.budget !== 'all' && budgetMeta) {
        if (vendor.startingPrice === null) {
          // Only include custom-quote vendors when Custom Quote priceType is explicitly checked or budget is 300k-plus
          if (
            !filters.priceTypes.includes('custom-quote') &&
            filters.budget !== '300k-plus'
          ) {
            return false;
          }
        } else {
          if (
            budgetMeta.min !== null &&
            vendor.startingPrice < budgetMeta.min
          ) {
            return false;
          }
          if (
            budgetMeta.max !== null &&
            vendor.startingPrice > budgetMeta.max
          ) {
            return false;
          }
        }
      }

      // 5. Price Type
      if (
        filters.priceTypes.length > 0 &&
        !filters.priceTypes.includes(vendor.priceType)
      ) {
        return false;
      }

      // 6. Services Offered
      if (filters.services.length > 0) {
        const matchesService = filters.services.some((selectedSrv) =>
          vendor.services.some(
            (vSrv) => vSrv.toLowerCase() === selectedSrv.toLowerCase()
          )
        );
        if (!matchesService) return false;
      }

      // 7. Verified Only
      if (filters.verifiedOnly && !vendor.verified) {
        return false;
      }

      // 8. Fast Response Only
      if (filters.fastResponseOnly && !vendor.respondsFast) {
        return false;
      }

      // 9. Guest Capacity
      if (
        filters.capacity !== 'all' &&
        !vendor.guestCapacity.includes(filters.capacity)
      ) {
        return false;
      }

      return true;
    });

    // Sort results consistently (Custom Quote / null startingPrice placed at end of price sorts)
    return [...matching].sort((a, b) => {
      if (filters.sort === 'price-asc') {
        if (a.startingPrice === null && b.startingPrice === null) return 0;
        if (a.startingPrice === null) return 1;
        if (b.startingPrice === null) return -1;
        return a.startingPrice - b.startingPrice;
      }

      if (filters.sort === 'price-desc') {
        if (a.startingPrice === null && b.startingPrice === null) return 0;
        if (a.startingPrice === null) return 1;
        if (b.startingPrice === null) return -1;
        return b.startingPrice - a.startingPrice;
      }

      if (filters.sort === 'recent') {
        return b.createdAt.localeCompare(a.createdAt);
      }

      // Default: 'recommended'
      if (a.verified !== b.verified) {
        return a.verified ? -1 : 1;
      }
      const ratingA = a.rating ?? 0;
      const ratingB = b.rating ?? 0;
      if (ratingB !== ratingA) {
        return ratingB - ratingA;
      }
      return (b.reviewCount ?? 0) - (a.reviewCount ?? 0);
    });
  }, [filters]);

  // Pagination slice (12 per page on desktop by default)
  const totalCount = filteredAndSortedVendors.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / filters.perPage));
  const safeCurrentPage = Math.min(filters.page, totalPages);
  const startOffset = (safeCurrentPage - 1) * filters.perPage;
  const paginatedVendors = filteredAndSortedVendors.slice(
    startOffset,
    startOffset + filters.perPage
  );
  const startIndex = totalCount > 0 ? startOffset + 1 : 0;
  const endIndex = Math.min(startOffset + filters.perPage, totalCount);

  // Active Category Title
  const activeCategoryOption =
    VENDOR_CATEGORY_OPTIONS.find((c) => c.value === filters.category) ||
    VENDOR_CATEGORY_OPTIONS[0];

  const activeLocationOption =
    LOCATION_AREA_OPTIONS.find((l) => l.value === filters.location) ||
    LOCATION_AREA_OPTIONS[0];

  const headingTitle =
    filters.category === 'all'
      ? `Event Vendors in ${activeLocationOption.shortLabel}`
      : `${activeCategoryOption.shortLabel} in ${activeLocationOption.shortLabel}`;

  // Build Active Filter Chips
  const activeChips: ActiveFilterChipItem[] = useMemo(() => {
    const chips: ActiveFilterChipItem[] = [];

    if (filters.category !== 'all') {
      const catOpt = VENDOR_CATEGORY_OPTIONS.find(
        (c) => c.value === filters.category
      );
      if (catOpt) {
        chips.push({
          key: `cat-${filters.category}`,
          label: catOpt.shortLabel,
          onRemove: () => updateUrlFilters({ category: 'all' }),
        });
      }
    }

    if (filters.event !== 'all') {
      const evOpt = EVENT_CATEGORY_OPTIONS.find(
        (e) => e.value === filters.event
      );
      if (evOpt) {
        chips.push({
          key: `ev-${filters.event}`,
          label: evOpt.label,
          onRemove: () => updateUrlFilters({ event: 'all' }),
        });
      }
    }

    if (filters.location !== 'hyderabad') {
      const locOpt = LOCATION_AREA_OPTIONS.find(
        (l) => l.value === filters.location
      );
      if (locOpt) {
        chips.push({
          key: `loc-${filters.location}`,
          label: locOpt.shortLabel,
          onRemove: () => updateUrlFilters({ location: 'hyderabad' }),
        });
      }
    }

    filters.areas.forEach((areaSlug) => {
      if (areaSlug === filters.location) return;
      const areaOpt = LOCATION_AREA_OPTIONS.find((l) => l.value === areaSlug);
      if (areaOpt) {
        chips.push({
          key: `area-${areaSlug}`,
          label: areaOpt.shortLabel,
          onRemove: () =>
            updateUrlFilters({
              areas: filters.areas.filter((a) => a !== areaSlug),
            }),
        });
      }
    });

    if (filters.budget !== 'all') {
      const bOpt = BUDGET_RANGE_OPTIONS.find((b) => b.value === filters.budget);
      if (bOpt) {
        chips.push({
          key: `budget-${filters.budget}`,
          label: bOpt.label,
          onRemove: () => updateUrlFilters({ budget: 'all' }),
        });
      }
    }

    filters.priceTypes.forEach((pt) => {
      const ptOpt = PRICE_TYPE_OPTIONS.find((p) => p.value === pt);
      if (ptOpt) {
        chips.push({
          key: `pt-${pt}`,
          label: ptOpt.label,
          onRemove: () =>
            updateUrlFilters({
              priceTypes: filters.priceTypes.filter((x) => x !== pt),
            }),
        });
      }
    });

    filters.services.forEach((srv) => {
      chips.push({
        key: `srv-${srv}`,
        label: srv,
        onRemove: () =>
          updateUrlFilters({
            services: filters.services.filter((s) => s !== srv),
          }),
      });
    });

    if (filters.verifiedOnly) {
      chips.push({
        key: 'verified-only',
        label: 'Audited On-Site',
        onRemove: () => updateUrlFilters({ verifiedOnly: false }),
      });
    }

    if (filters.fastResponseOnly) {
      chips.push({
        key: 'fast-response',
        label: 'Responds < 2 hrs',
        onRemove: () => updateUrlFilters({ fastResponseOnly: false }),
      });
    }

    if (filters.capacity !== 'all') {
      const capOpt = GUEST_CAPACITY_OPTIONS.find(
        (c) => c.value === filters.capacity
      );
      if (capOpt) {
        chips.push({
          key: `cap-${filters.capacity}`,
          label: capOpt.label,
          onRemove: () => updateUrlFilters({ capacity: 'all' }),
        });
      }
    }

    return chips;
  }, [filters, updateUrlFilters]);

  function handleResetAllFilters() {
    router.push('/vendors?location=hyderabad', { scroll: false });
  }

  function handleToggleArea(area: Exclude<VendorLocationSlug, 'hyderabad'>) {
    // If top location dropdown matches this area, clear top location too when unchecking
    const isCurrentlyInAreas = filters.areas.includes(area);
    const isTopLocation = filters.location === area;

    if (isCurrentlyInAreas || isTopLocation) {
      updateUrlFilters({
        location: isTopLocation ? 'hyderabad' : filters.location,
        areas: filters.areas.filter((a) => a !== area),
      });
    } else {
      updateUrlFilters({
        areas: [...filters.areas, area],
      });
    }
  }

  function handleTogglePriceType(pt: PriceTypeSlug) {
    const exists = filters.priceTypes.includes(pt);
    updateUrlFilters({
      priceTypes: exists
        ? filters.priceTypes.filter((x) => x !== pt)
        : [...filters.priceTypes, pt],
    });
  }

  function handleToggleService(srv: string) {
    const exists = filters.services.includes(srv);
    updateUrlFilters({
      services: exists
        ? filters.services.filter((s) => s !== srv)
        : [...filters.services, srv],
    });
  }

  return (
    <div className="w-full bg-brand-ivory min-h-screen pb-16">
      {/* Top Breadcrumbs, Hero Strip & Persistent 5-Column Search Bar */}
      <VendorSearchBar
        selectedEvent={filters.event}
        selectedCategory={filters.category}
        selectedLocation={filters.location}
        selectedBudget={filters.budget}
        activeCategoryTitle={
          filters.category === 'all'
            ? 'All Event Vendors'
            : activeCategoryOption.shortLabel
        }
        onApplySearch={(criteria) => {
          setIsLoading(true);
          updateUrlFilters({
            event: criteria.event,
            category: criteria.category,
            location: criteria.location,
            budget: criteria.budget,
            areas:
              criteria.location === 'hyderabad'
                ? []
                : [criteria.location],
          });
          setTimeout(() => setIsLoading(false), 140);
        }}
      />

      {/* MAIN TWO-COLUMN MARKETPLACE LAYOUT */}
      <div className="ay-container pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT SIDEBAR FILTERS (Desktop lg+) */}
          <aside
            aria-label="Vendor Filter Sidebar"
            className="hidden lg:block lg:col-span-4 xl:col-span-3"
          >
            <VendorFilterSidebar
              filters={filters}
              onSelectCategory={(category) => updateUrlFilters({ category })}
              onToggleArea={handleToggleArea}
              onSelectBudget={(budget) => updateUrlFilters({ budget })}
              onTogglePriceType={handleTogglePriceType}
              onToggleService={handleToggleService}
              onToggleVerifiedOnly={() =>
                updateUrlFilters({ verifiedOnly: !filters.verifiedOnly })
              }
              onToggleFastResponse={() =>
                updateUrlFilters({
                  fastResponseOnly: !filters.fastResponseOnly,
                })
              }
              onSelectCapacity={(capacity) => updateUrlFilters({ capacity })}
              onResetAll={handleResetAllFilters}
            />
          </aside>

          {/* RIGHT RESULTS SECTION (3-Column Desktop Grid) */}
          <section
            aria-label="Vendor Search Results"
            className="lg:col-span-8 xl:col-span-9 flex flex-col gap-5"
          >
            {/* Results Header Bar: Title, Count, Mobile Filter Trigger, Sort & Active Filter Chips */}
            <VendorResultsHeader
              headingTitle={headingTitle}
              startIndex={startIndex}
              endIndex={endIndex}
              totalCount={totalCount}
              sort={filters.sort}
              onSortChange={(sort) => updateUrlFilters({ sort }, false)}
              activeChips={activeChips}
              onClearAllFilters={handleResetAllFilters}
              onOpenMobileFilters={() => setIsMobileDrawerOpen(true)}
            />

            {/* Results Content: Error / Loading / Empty / 3-Col Grid */}
            {errorMessage ? (
              <VendorSearchErrorState
                message={errorMessage}
                onRetry={() => setErrorMessage(null)}
              />
            ) : isLoading ? (
              <VendorListingSkeletonGrid />
            ) : paginatedVendors.length === 0 ? (
              <EmptySearchState
                onClearAllFilters={handleResetAllFilters}
                onBroadenBudget={() => updateUrlFilters({ budget: 'all' })}
                onResetLocation={() =>
                  updateUrlFilters({ location: 'hyderabad', areas: [] })
                }
              />
            ) : (
              <>
                <VendorListingGrid vendors={paginatedVendors} />

                {/* Pagination Bar */}
                <VendorPagination
                  currentPage={safeCurrentPage}
                  totalPages={totalPages}
                  startIndex={startIndex}
                  endIndex={endIndex}
                  totalCount={totalCount}
                  perPage={filters.perPage}
                  onPageChange={(page) => {
                    updateUrlFilters({ page }, false);
                    window.scrollTo({ top: 260, behavior: 'smooth' });
                  }}
                  onPerPageChange={(perPage) =>
                    updateUrlFilters({ perPage }, true)
                  }
                />
              </>
            )}

            {/* Stitch Bottom Callout Cards: Trust Protocol & Venue Empanelment Guidance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              <div className="bg-brand-white p-5 rounded-2xl border border-border-default flex items-start gap-3.5 shadow-xs">
                <span className="material-symbols-outlined text-brand-gold-dark text-[28px] shrink-0 mt-0.5">
                  verified
                </span>
                <div className="flex flex-col">
                  <h3 className="text-h4 text-brand-green font-bold">
                    AyojanSetu Trust &amp; Auditing Protocol
                  </h3>
                  <p className="text-small text-text-secondary mt-1 leading-relaxed">
                    Every verified listing undergoes physical inspection of
                    studio inventory, service credentials, and client reference
                    checks before receiving the Ayojan Verified badge.
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      openEnquiryModal('AyojanSetu Verification Standards Desk')
                    }
                    className="text-label text-brand-gold-dark hover:text-brand-green font-semibold mt-2 inline-flex items-center gap-1 w-fit transition-colors"
                  >
                    <span>Read our verification standard</span>
                    <span className="material-symbols-outlined text-[14px]">
                      arrow_forward
                    </span>
                  </button>
                </div>
              </div>

              <div className="bg-brand-white p-5 rounded-2xl border border-border-default flex items-start gap-3.5 shadow-xs">
                <span className="material-symbols-outlined text-brand-green text-[28px] shrink-0 mt-0.5">
                  manage_search
                </span>
                <div className="flex flex-col">
                  <h3 className="text-h4 text-brand-green font-bold">
                    Looking for a specific Hyderabad venue match?
                  </h3>
                  <p className="text-small text-text-secondary mt-1 leading-relaxed">
                    Need vendors pre-approved for convention halls, resorts, or
                    heritage lawns in Hyderabad? Our concierge helps match vendor
                    empanelment directly.
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      openEnquiryModal('Hyderabad Custom Venue Matching')
                    }
                    className="text-label text-brand-green hover:text-brand-green-hover font-semibold mt-2 inline-flex items-center gap-1 w-fit transition-colors"
                  >
                    <span>Request custom venue matching</span>
                    <span className="material-symbols-outlined text-[14px]">
                      arrow_forward
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Mobile / Tablet Slide-In Filter Drawer */}
      <VendorFilterDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        totalMatchingCount={totalCount}
        filters={filters}
        onSelectCategory={(category) => updateUrlFilters({ category })}
        onToggleArea={handleToggleArea}
        onSelectBudget={(budget) => updateUrlFilters({ budget })}
        onTogglePriceType={handleTogglePriceType}
        onToggleService={handleToggleService}
        onToggleVerifiedOnly={() =>
          updateUrlFilters({ verifiedOnly: !filters.verifiedOnly })
        }
        onToggleFastResponse={() =>
          updateUrlFilters({ fastResponseOnly: !filters.fastResponseOnly })
        }
        onSelectCapacity={(capacity) => updateUrlFilters({ capacity })}
        onResetAll={handleResetAllFilters}
      />
    </div>
  );
}
