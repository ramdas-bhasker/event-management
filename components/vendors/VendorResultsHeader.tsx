'use client';

import { ActiveFilterChips } from '@/components/vendors/ActiveFilterChips';
import { VendorSortDropdown } from '@/components/vendors/VendorSortDropdown';
import type { ActiveFilterChipItem, VendorSortOption } from '@/types/vendor';

interface VendorResultsHeaderProps {
  headingTitle: string;
  startIndex: number;
  endIndex: number;
  totalCount: number;
  sort: VendorSortOption;
  onSortChange: (sort: VendorSortOption) => void;
  activeChips: ActiveFilterChipItem[];
  onClearAllFilters: () => void;
  onOpenMobileFilters: () => void;
}

export function VendorResultsHeader({
  headingTitle,
  startIndex,
  endIndex,
  totalCount,
  sort,
  onSortChange,
  activeChips,
  onClearAllFilters,
  onOpenMobileFilters,
}: VendorResultsHeaderProps) {
  return (
    <div className="bg-brand-white p-4 sm:p-5 rounded-2xl border border-border-default shadow-xs flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-baseline gap-2.5">
          <h2 className="text-h2 text-brand-green font-bold">{headingTitle}</h2>
          <span className="bg-brand-ivory border border-border-default text-text-secondary text-badge px-2.5 py-0.5 rounded-full font-semibold">
            {totalCount > 0
              ? `Showing ${startIndex}–${endIndex} of ${totalCount} Vendors`
              : '0 Matching Vendors'}
          </span>
        </div>

        {/* Mobile Filter Trigger + Sort Dropdown */}
        <div className="flex items-center justify-between sm:justify-end gap-2.5">
          <button
            type="button"
            onClick={onOpenMobileFilters}
            className="lg:hidden inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-brand-ivory border border-border-default text-brand-green text-xs font-semibold hover:border-brand-green transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">tune</span>
            <span>Filters</span>
            {activeChips.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-brand-green text-brand-white text-[10px] font-bold">
                {activeChips.length}
              </span>
            )}
          </button>

          <VendorSortDropdown value={sort} onChange={onSortChange} />
        </div>
      </div>

      {/* Active Filter Chips Bar */}
      <ActiveFilterChips
        chips={activeChips}
        onClearAll={onClearAllFilters}
      />
    </div>
  );
}
