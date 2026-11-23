'use client';

import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useUiStore } from '@/stores/ui-store';
import type { VendorRecord } from '@/types/vendor';

interface VendorListingCardProps {
  vendor: VendorRecord;
}

export function VendorListingCard({ vendor }: VendorListingCardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookmarkedVendorIds = useUiStore((s) => s.bookmarkedVendorIds);
  const toggleVendorBookmark = useUiStore((s) => s.toggleVendorBookmark);

  const isSaved = bookmarkedVendorIds.includes(vendor.id);
  const primaryImage =
    vendor.portfolioImages[0] || '/images/luxury_wedding_decor.png';

  function handleNavigateDetails() {
    const query = searchParams?.toString() ?? '';
    router.push(`/vendors/${vendor.slug}${query ? `?${query}` : ''}`);
  }

  return (
    <article
      onClick={handleNavigateDetails}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleNavigateDetails();
        }
      }}
      tabIndex={0}
      role="link"
      aria-label={`View details for ${vendor.businessName}`}
      className="bg-brand-white rounded-2xl shadow-xs hover:shadow-md transition-all border border-border-default hover:border-brand-gold flex flex-col overflow-hidden group cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-green"
    >
      {/* Top 4:3 Image Frame */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-brand-ivory">
        <Image
          src={primaryImage}
          alt={`${vendor.businessName} – ${vendor.categoryLabel} in ${vendor.location}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Specialty Pill (Top-Left) */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-brand-green/90 text-brand-white backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-semibold shadow-xs">
          <span className="material-symbols-outlined text-[13px] text-brand-gold">
            {vendor.specialtyIcon}
          </span>
          <span>{vendor.specialtyBadge}</span>
        </div>

        {/* Save / Shortlist Button (Top-Right) */}
        <button
          type="button"
          aria-label={
            isSaved
              ? `Remove ${vendor.businessName} from saved shortlist`
              : `Save ${vendor.businessName} to shortlist`
          }
          aria-pressed={isSaved}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleVendorBookmark(vendor.id);
          }}
          className={cn(
            'absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-brand-white/90 backdrop-blur-sm border border-border-default flex items-center justify-center transition-colors shadow-xs',
            isSaved
              ? 'text-state-error'
              : 'text-text-primary hover:text-state-error'
          )}
        >
          <span
            className="material-symbols-outlined text-[18px]"
            style={{
              fontVariationSettings: isSaved ? "'FILL' 1" : "'FILL' 0",
            }}
          >
            favorite
          </span>
        </button>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Verification & Rating Row */}
          <div className="flex items-center justify-between gap-1.5 mb-1.5">
            {vendor.verified ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#FFDEA6] bg-brand-green px-2 py-0.5 rounded">
                <span className="material-symbols-outlined text-[12px] text-brand-gold">
                  verified
                </span>
                <span>Ayojan Verified</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-text-secondary bg-brand-ivory border border-border-default px-2 py-0.5 rounded">
                <span>{vendor.categoryLabel}</span>
              </span>
            )}

            {typeof vendor.rating === 'number' &&
            typeof vendor.reviewCount === 'number' &&
            vendor.reviewCount > 0 ? (
              <div className="flex items-center gap-0.5 text-xs font-semibold text-brand-green">
                <span
                  className="material-symbols-outlined text-[15px] text-brand-gold"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
                <span>{vendor.rating.toFixed(1)}</span>
                <span className="text-text-secondary font-normal">
                  ({vendor.reviewCount})
                </span>
              </div>
            ) : null}
          </div>

          {/* Business Name */}
          <h3 className="text-[16px] leading-snug font-bold text-brand-green group-hover:text-brand-green-hover transition-colors line-clamp-1">
            {vendor.businessName}
          </h3>

          {/* Category & Location */}
          <p className="text-xs text-text-secondary flex items-center gap-1 mt-0.5">
            <span className="material-symbols-outlined text-[14px] text-brand-gold-dark">
              location_on
            </span>
            <span className="truncate">
              {vendor.location} · {vendor.categoryLabel}
            </span>
          </p>

          {/* Short Description */}
          <p className="text-xs text-text-secondary mt-2 line-clamp-2 leading-relaxed">
            {vendor.description}
          </p>

          {/* Services / Specialities Chips */}
          <div className="flex flex-wrap gap-1 mt-3">
            {vendor.services.slice(0, 3).map((srv) => (
              <span
                key={srv}
                className="bg-brand-ivory border border-border-default text-text-secondary text-[11px] px-2 py-0.5 rounded font-medium"
              >
                {srv}
              </span>
            ))}
          </div>
        </div>

        {/* Price & Action Footer */}
        <div className="pt-3 mt-4 border-t border-border-default flex flex-col gap-2.5">
          <div className="flex items-baseline justify-between">
            <span className="text-[11px] uppercase font-semibold text-text-secondary">
              {vendor.priceCaption}
            </span>
            <span className="text-[16px] font-bold text-brand-green">
              {vendor.priceDisplay}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNavigateDetails();
              }}
              className="py-2 px-3 rounded-lg border border-border-default bg-brand-ivory hover:bg-brand-ivory-hover hover:border-brand-green text-brand-green text-xs font-semibold transition-colors text-center"
            >
              View Details
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/enquiry?vendorId=${encodeURIComponent(vendor.slug)}`);
              }}
              className="py-2 px-3 rounded-lg bg-brand-green hover:bg-brand-green-hover text-brand-white text-xs font-semibold transition-colors text-center inline-flex items-center justify-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">chat</span>
              <span>Enquire</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
