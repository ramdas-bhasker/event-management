'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/common/Container';
import {
  FEATURED_VENDORS,
  MICRO_MARKET_OPTIONS,
  SERVICE_TYPE_OPTIONS,
} from '@/lib/constants';
import { MOCK_VENDORS } from '@/data/mock-vendors';
import { cn } from '@/lib/utils';
import { useUiStore } from '@/stores/ui-store';
import type { FeaturedVendor } from '@/types';

export function FeaturedVendors() {
  const router = useRouter();
  const bookmarkedVendorIds = useUiStore((s) => s.bookmarkedVendorIds);
  const toggleVendorBookmark = useUiStore((s) => s.toggleVendorBookmark);

  const selectedEventType = useUiStore((s) => s.selectedEventType);
  const selectedService = useUiStore((s) => s.selectedService);
  const selectedLocation = useUiStore((s) => s.selectedLocation);
  const selectedDateLabel = useUiStore((s) => s.selectedDateLabel);
  const isSearchPrototypeActive = useUiStore((s) => s.isSearchPrototypeActive);
  const resetSearchFilters = useUiStore((s) => s.resetSearchFilters);

  const activeServiceLabel =
    SERVICE_TYPE_OPTIONS.find((s) => s.value === selectedService)?.label ||
    'All Services';
  const activeLocationLabel =
    MICRO_MARKET_OPTIONS.find((l) => l.value === selectedLocation)?.label ||
    'All Hyderabad';

  const matchingVendors = FEATURED_VENDORS.filter((v) => {
    const serviceMatch =
      selectedService === 'all' || v.serviceId === selectedService;
    const locationMatch =
      selectedLocation === 'all' || v.locationId === selectedLocation;
    return serviceMatch && locationMatch;
  });

  const visibleVendors =
    !isSearchPrototypeActive || matchingVendors.length > 0
      ? matchingVendors
      : FEATURED_VENDORS;

  function handleOpenVendorProfile(vendor: FeaturedVendor) {
    const matchingRecord = MOCK_VENDORS.find((record) => record.businessName === vendor.name);
    router.push(`/vendors/${matchingRecord?.slug ?? vendor.id}`);
  }

  return (
    <section id="featured-vendors" className="hp-section hp-section-ivory">
      <Container>
        <div className="section-header-row">
          <div>
            <div className="section-eyebrow">
              <span>Hyderabad Marketplace Directory</span>
              <span className="badge badge-gold" style={{ marginLeft: '6px' }}>
                Sample Preview Data
              </span>
            </div>
            <h2 className="text-h1">Featured Hyderabad Vendors</h2>
            <p
              className="text-body"
              style={{ color: 'var(--text-secondary)', marginTop: '4px' }}
            >
              Explore sample vendor profiles below to preview how service categories,
              starting prices, and direct enquiries work.
            </p>
          </div>
          <Link
            href="/vendors?location=hyderabad"
            className="section-link"
          >
            <span>Show All Sample Vendors</span>
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </div>

        {/* Dynamic Search Filter Prototype Banner */}
        <div
          id="searchPrototypeBanner"
          className={cn(
            'search-prototype-status',
            isSearchPrototypeActive && 'is-visible'
          )}
          role="status"
          aria-live="polite"
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              flexWrap: 'wrap',
            }}
          >
            <span className="badge badge-green">
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                filter_alt
              </span>
              <span>Active Search Prototype</span>
            </span>
            <span className="text-body" style={{ fontWeight: 500 }}>
              Filters: {selectedEventType} · {activeServiceLabel} · {activeLocationLabel}{' '}
              · {selectedDateLabel}
              {isSearchPrototypeActive && matchingVendors.length === 0
                ? ' (Showing all 4 sample listings in this prototype)'
                : ''}
            </span>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-outline"
            onClick={resetSearchFilters}
          >
            Reset Filters
          </button>
        </div>

        <div className="vendors-grid">
          {visibleVendors.map((vendor) => {
            const isBookmarked = bookmarkedVendorIds.includes(vendor.id);

            return (
              <article
                key={vendor.id}
                className="ay-card ay-card-interactive vendor-card vendor-card-clickable"
                onClick={() => handleOpenVendorProfile(vendor)}
              >
                <div>
                  <div className="vendor-card-media">
                    <Image
                      src={vendor.imageUrl}
                      alt={vendor.imageAlt}
                      fill
                      loading="lazy"
                      sizes="(max-width: 540px) 100vw, (max-width: 1100px) 50vw, 25vw"
                      style={{ objectFit: 'cover' }}
                    />
                    <div className="vendor-verified-badge">
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: '13px' }}
                      >
                        info
                      </span>
                      <span>{vendor.badgeLabel}</span>
                    </div>
                    <button
                      type="button"
                      className={cn(
                        'vendor-bookmark-btn',
                        isBookmarked && 'is-active'
                      )}
                      aria-label={`Save ${vendor.name} to shortlist`}
                      aria-pressed={isBookmarked}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleVendorBookmark(vendor.id);
                      }}
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{
                          fontSize: '18px',
                          fontVariationSettings: isBookmarked ? "'FILL' 1" : "'FILL' 0",
                        }}
                      >
                        favorite
                      </span>
                    </button>
                  </div>

                  <div className="vendor-card-body">
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '6px',
                        marginBottom: '6px',
                      }}
                    >
                      <span className="vendor-category-tag">
                        <span
                          className="material-symbols-outlined"
                          style={{ fontSize: '13px' }}
                        >
                          {vendor.categoryIcon}
                        </span>
                        <span>{vendor.categoryLabel}</span>
                      </span>
                      {vendor.rating && vendor.reviewCount ? (
                        <div className="vendor-rating-row" style={{ marginBottom: 0 }}>
                          <span
                            className="material-symbols-outlined"
                            style={{
                              fontSize: '15px',
                              color: 'var(--brand-gold)',
                              fontVariationSettings: "'FILL' 1",
                            }}
                          >
                            star
                          </span>
                          <span className="text-label" style={{ fontWeight: 700 }}>
                            {vendor.rating}
                          </span>
                          <span
                            className="text-small"
                            style={{ color: 'var(--text-secondary)' }}
                          >
                            ({vendor.reviewCount})
                          </span>
                        </div>
                      ) : (
                        <span
                          className="text-small"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          No reviews yet
                        </span>
                      )}
                    </div>

                    <h3 className="text-h4" style={{ fontWeight: 600 }}>
                      {vendor.name}
                    </h3>
                    <p
                      className="text-small"
                      style={{
                        color: 'var(--text-secondary)',
                        marginTop: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: '14px', color: 'var(--brand-gold-dark)' }}
                      >
                        location_on
                      </span>
                      <span>{vendor.location}</span>
                    </p>
                    <div className="vendor-price-box">
                      <span
                        className="text-badge"
                        style={{
                          color: 'var(--text-secondary)',
                          textTransform: 'uppercase',
                          display: 'block',
                        }}
                      >
                        {vendor.priceCaption}
                      </span>
                      <span
                        className="text-label"
                        style={{ color: 'var(--brand-green)', fontWeight: 700 }}
                      >
                        {vendor.priceValue}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="vendor-card-actions">
                  <button
                    type="button"
                    className="btn btn-sm btn-secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenVendorProfile(vendor);
                    }}
                  >
                    View Profile
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/enquiry?vendorId=${encodeURIComponent(vendor.id)}`);
                    }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: '16px' }}
                    >
                      chat
                    </span>
                    <span>Enquire</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
