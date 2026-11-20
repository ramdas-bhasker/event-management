'use client';

import { useEffect } from 'react';
import { VendorFilterSidebar } from '@/components/vendors/VendorFilterSidebar';
import type {
  BudgetRangeSlug,
  GuestCapacitySlug,
  PriceTypeSlug,
  VendorCategorySlug,
  VendorFilterState,
  VendorLocationSlug,
} from '@/types/vendor';

interface VendorFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  totalMatchingCount: number;
  filters: VendorFilterState;
  onSelectCategory: (category: VendorCategorySlug) => void;
  onToggleArea: (area: Exclude<VendorLocationSlug, 'hyderabad'>) => void;
  onSelectBudget: (budget: BudgetRangeSlug) => void;
  onTogglePriceType: (priceType: PriceTypeSlug) => void;
  onToggleService: (service: string) => void;
  onToggleVerifiedOnly: () => void;
  onToggleFastResponse: () => void;
  onSelectCapacity: (capacity: GuestCapacitySlug) => void;
  onResetAll: () => void;
}

export function VendorFilterDrawer({
  isOpen,
  onClose,
  totalMatchingCount,
  filters,
  onSelectCategory,
  onToggleArea,
  onSelectBudget,
  onTogglePriceType,
  onToggleService,
  onToggleVerifiedOnly,
  onToggleFastResponse,
  onSelectCapacity,
  onResetAll,
}: VendorFilterDrawerProps) {
  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 lg:hidden flex justify-end bg-brand-green/55 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label="Filter Vendors"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md bg-brand-ivory h-full flex flex-col shadow-lg overflow-hidden">
        {/* Drawer Header */}
        <div className="bg-brand-green text-brand-white px-5 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-brand-gold text-[20px]">
              tune
            </span>
            <h2 className="text-h4 font-bold text-brand-white">
              Filter Hyderabad Vendors
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close filter drawer"
            className="w-8 h-8 rounded-lg bg-brand-white/10 text-brand-white flex items-center justify-center hover:bg-brand-white/20 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Scrollable Filter Body */}
        <div className="flex-1 overflow-y-auto p-4">
          <VendorFilterSidebar
            filters={filters}
            onSelectCategory={onSelectCategory}
            onToggleArea={onToggleArea}
            onSelectBudget={onSelectBudget}
            onTogglePriceType={onTogglePriceType}
            onToggleService={onToggleService}
            onToggleVerifiedOnly={onToggleVerifiedOnly}
            onToggleFastResponse={onToggleFastResponse}
            onSelectCapacity={onSelectCapacity}
            onResetAll={onResetAll}
            showConciergeCard={false}
          />
        </div>

        {/* Sticky Drawer Footer */}
        <div className="bg-brand-white border-t border-border-default p-4 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onResetAll}
            className="btn btn-md btn-outline flex-1"
          >
            Reset All
          </button>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-md btn-primary flex-1"
          >
            Show {totalMatchingCount} Vendors
          </button>
        </div>
      </div>
    </div>
  );
}
